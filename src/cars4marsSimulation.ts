export type GradeParameters = {
  mass_kg: number;
  slope_deg: number;
  wheel_radius_m: number;
  total_drive_torque_nm: number;
  drivetrain_efficiency: number;
  rolling_resistance_coeff: number;
  traction_mu: number;
  initial_speed_mps: number;
  duration_s: number;
  dt_ms: number;
};

export type HeartbeatParameters = {
  initial_speed_mps: number;
  command_timeout_ms: number;
  assumed_braking_deceleration_mps2: number;
  dt_ms: number;
};

export type SensitivityParameters = {
  mass_kg: number;
  slope_deg: number;
  wheel_radius_m: number;
  rolling_resistance_coeff: number;
  torques_nm: number[];
  efficiencies: number[];
  traction_coefficients: number[];
};

export type SimulationScenario = {
  id: string;
  label: string;
  kind: 'grade' | 'heartbeat_loss' | 'grade_sensitivity';
  visual_status: string;
  parameters: GradeParameters | HeartbeatParameters | SensitivityParameters;
  purpose: string;
};

export type SimulationContract = {
  schema: 'cars4mars.sim.scenarios.v1';
  baseline: 'DFR-01';
  truth_boundary: string;
  model: string;
  scenarios: SimulationScenario[];
  unknowns_to_replace: string[];
};

export type SimulationFrame = {
  t_ms: number;
  x_m: number;
  z_m: number;
  pitch_rad: number;
  linear_mps: number;
  motor_enable: boolean;
  command_alive: boolean;
  net_force_n: number | null;
  traction_limited: boolean | null;
  state: string;
};

export type GradeSummary = {
  gravity_downslope_n: number;
  normal_force_n: number;
  rolling_resistance_n: number;
  drive_force_before_traction_n: number;
  traction_limit_n: number;
  usable_drive_force_n: number;
  net_uphill_force_n: number;
  acceleration_mps2: number;
  traction_limited: boolean;
  status: string;
};

export type SimulationEvaluation = {
  frame: SimulationFrame;
  summary: GradeSummary | {
    timeout_distance_m: number;
    assumed_braking_distance_m: number;
    assumed_total_stop_distance_m: number;
    assumed_total_stop_time_s: number;
  } | null;
  duration_s: number;
};

const G = 9.81;

export async function loadSimulationContract(signal?: AbortSignal): Promise<SimulationContract> {
  const response = await fetch('/cars4mars/simulation-scenarios.json', { signal, cache: 'no-cache' });
  if (!response.ok) throw new Error(`simulation contract HTTP ${response.status}`);
  const payload = await response.json() as SimulationContract;
  if (payload.schema !== 'cars4mars.sim.scenarios.v1' || payload.baseline !== 'DFR-01') {
    throw new Error('invalid Cars4Mars simulation contract');
  }
  return payload;
}

function isGrade(scenario: SimulationScenario): scenario is SimulationScenario & { parameters: GradeParameters } {
  return scenario.kind === 'grade';
}

function isHeartbeat(scenario: SimulationScenario): scenario is SimulationScenario & { parameters: HeartbeatParameters } {
  return scenario.kind === 'heartbeat_loss';
}

export function evaluateGrade(parameters: GradeParameters): GradeSummary {
  const theta = parameters.slope_deg * Math.PI / 180;
  const gravity = parameters.mass_kg * G * Math.sin(theta);
  const normal = parameters.mass_kg * G * Math.cos(theta);
  const rolling = parameters.rolling_resistance_coeff * normal;
  const driveBeforeTraction = parameters.total_drive_torque_nm * parameters.drivetrain_efficiency / parameters.wheel_radius_m;
  const tractionLimit = parameters.traction_mu * normal;
  const usableDrive = Math.min(driveBeforeTraction, tractionLimit);
  const net = usableDrive - gravity - rolling;
  const acceleration = net / parameters.mass_kg;
  const tractionLimited = tractionLimit < driveBeforeTraction;
  const tolerance = 1e-6;
  const status = net > tolerance ? 'accelerating_uphill' : net < -tolerance ? 'insufficient_uphill_force' : 'ideal_grade_hold';
  return {
    gravity_downslope_n: gravity,
    normal_force_n: normal,
    rolling_resistance_n: rolling,
    drive_force_before_traction_n: driveBeforeTraction,
    traction_limit_n: tractionLimit,
    usable_drive_force_n: usableDrive,
    net_uphill_force_n: net,
    acceleration_mps2: acceleration,
    traction_limited: tractionLimited,
    status,
  };
}

export function evaluateScenario(scenario: SimulationScenario, elapsedSeconds: number): SimulationEvaluation {
  if (isGrade(scenario)) {
    const p = scenario.parameters;
    const summary = evaluateGrade(p);
    const duration = p.duration_s;
    const t = Math.max(0, Math.min(elapsedSeconds, duration));
    const distance = p.initial_speed_mps * t + 0.5 * summary.acceleration_mps2 * t * t;
    const velocity = p.initial_speed_mps + summary.acceleration_mps2 * t;
    const theta = p.slope_deg * Math.PI / 180;
    return {
      duration_s: duration,
      summary,
      frame: {
        t_ms: Math.round(t * 1000),
        x_m: distance * Math.cos(theta),
        z_m: distance * Math.sin(theta),
        pitch_rad: theta,
        linear_mps: velocity,
        motor_enable: true,
        command_alive: true,
        net_force_n: summary.net_uphill_force_n,
        traction_limited: summary.traction_limited,
        state: summary.status,
      },
    };
  }

  if (isHeartbeat(scenario)) {
    const p = scenario.parameters;
    const timeoutS = p.command_timeout_ms / 1000;
    const brakeTimeS = p.initial_speed_mps / p.assumed_braking_deceleration_mps2;
    const duration = timeoutS + brakeTimeS;
    const t = Math.max(0, Math.min(elapsedSeconds, duration));
    const timeoutDistance = p.initial_speed_mps * timeoutS;
    const brakingDistance = p.initial_speed_mps ** 2 / (2 * p.assumed_braking_deceleration_mps2);

    let x: number;
    let velocity: number;
    let motorEnable: boolean;
    let state: string;
    if (t <= timeoutS) {
      x = p.initial_speed_mps * t;
      velocity = p.initial_speed_mps;
      motorEnable = true;
      state = 'command_lost_waiting_for_timeout';
    } else {
      const tau = Math.min(t - timeoutS, brakeTimeS);
      velocity = Math.max(0, p.initial_speed_mps - p.assumed_braking_deceleration_mps2 * tau);
      x = timeoutDistance + p.initial_speed_mps * tau - 0.5 * p.assumed_braking_deceleration_mps2 * tau * tau;
      motorEnable = false;
      state = velocity > 0 ? 'decelerating_after_motor_disable' : 'stopped';
    }

    return {
      duration_s: duration,
      summary: {
        timeout_distance_m: timeoutDistance,
        assumed_braking_distance_m: brakingDistance,
        assumed_total_stop_distance_m: timeoutDistance + brakingDistance,
        assumed_total_stop_time_s: duration,
      },
      frame: {
        t_ms: Math.round(t * 1000),
        x_m: x,
        z_m: 0,
        pitch_rad: 0,
        linear_mps: velocity,
        motor_enable: motorEnable,
        command_alive: false,
        net_force_n: null,
        traction_limited: null,
        state,
      },
    };
  }

  return {
    duration_s: 0,
    summary: null,
    frame: {
      t_ms: 0, x_m: 0, z_m: 0, pitch_rad: 0, linear_mps: 0,
      motor_enable: false, command_alive: false, net_force_n: null,
      traction_limited: null, state: 'parameter_sweep',
    },
  };
}
