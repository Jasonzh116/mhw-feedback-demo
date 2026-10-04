## [打开反馈演示](https://jasonzh116.github.io/mhw-feedback-demo/)

# MHW synthetic feedback demo

One continuously varying 120-second synthetic browser replay. Seeded, gently varying toy-marker amplitudes are processed through the existing MHW v0.2 marker and rolling-feedback pipeline at 150 Hz, with the original alternating event cadence (100 frames per side, 50-frame offset) and 10 Hz replay snapshots. Valid nonnegative step-level excursions feed independent causal 10-second medians. The displayed difference is not randomized directly. The first 10 seconds remain a signal-collection warmup; variation continues through 120 seconds, both positive and negative and inside/outside the ±3-degree target.

This public repository contains only browser assets and synthetic participant-feedback records. No real participant data, private Python package, PCA implementation, or trained models are included. Clinical live mode is disabled. The synthetic pattern is illustrative, not a validated physiological motion model or evidence of hardware latency, event detection, or clinical effectiveness.

At 55–57 and 96–98 seconds, explicitly injected synthetic quality flags immediately show a steady red alert and suppress numeric/directional feedback, independently of the 10-second median and ±3-degree target. They do not detect real stumbles or falls. Recovery requires the flag to clear and a valid visible state. Hidden, missing and invalid states clear stale numeric feedback and foot asymmetry; hidden control feedback remains hidden. Ordinary outside-target values are not anomaly flags.

The LEFT/RIGHT selector maps the symptomatic side to the subject's actual left or right foot (own-view orientation). The signed difference remains median(symptomatic MHW) − median(contralateral MHW). Positive values emphasize the selected symptomatic foot; negative values emphasize the opposite foot; valid zero gives equal shapes. Foot sizes are a bounded MHW difference metaphor, not anatomical size or independent side measurements. Pause/resume, restart and timeline scrubbing are available; restarting replays the same seeded record.
