## [打开反馈演示](https://jasonzh116.github.io/mhw-feedback-demo/)

# MHW synthetic feedback demo

A 120-second synthetic browser replay generated through the MHW v0.2 simulation and feedback pipeline at 150 Hz, sampled into displayed records at 10 Hz. This public repository contains only browser assets and synthetic participant-feedback records. No real participant data, Python package, PCA implementation, or trained models are included.

The target is ±3 degrees. Valid zero, warmup, missing signals, and control-group hidden feedback are distinct states. Clinical live mode is disabled. This demo does not validate hardware latency, event detection, or clinical effectiveness.

The visible LEFT/RIGHT selector maps the symptomatic side to the subject's actual left or right foot (own-view orientation). The signed difference remains median(symptomatic MHW) − median(contralateral MHW). Positive values emphasize the selected symptomatic foot; negative values emphasize the opposite foot; valid zero gives equal shapes. Foot sizes are a bounded MHW difference metaphor, not anatomical size or independent side measurements. Invalid or hidden feedback clears the asymmetry.
