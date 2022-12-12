import { palette } from '../../utils/palettePackage';

const shiftRightStop = (scale, selectedKnob, meta, ctrl, presetName, presetMin, presetMax) => {
  let stopsList = [],
      newLightnessScale = {},
      selectedKnobIndex;

  Object.keys(scale).forEach(stop => {
    stopsList.push(stop)
  });
  selectedKnobIndex = stopsList.indexOf(selectedKnob.classList[1])
  newLightnessScale = scale;

  const currentStopValue: number = parseFloat(newLightnessScale[stopsList[selectedKnobIndex]]),
        nextStopValue: number = parseFloat(newLightnessScale[stopsList[selectedKnobIndex - 1]]) - 2

  if (currentStopValue >= nextStopValue)
    null
  else if (currentStopValue >= 99 && (!meta || ctrl))
    newLightnessScale[stopsList[selectedKnobIndex]] = 100
  else if (currentStopValue === 100 && (meta || ctrl))
    newLightnessScale[stopsList[selectedKnobIndex]] = 100
  else
    meta || ctrl ?
    newLightnessScale[stopsList[selectedKnobIndex]] = parseFloat(newLightnessScale[stopsList[selectedKnobIndex]]) + .1 :
    newLightnessScale[stopsList[selectedKnobIndex]]++;

  newLightnessScale[stopsList[selectedKnobIndex]] = parseFloat(newLightnessScale[stopsList[selectedKnobIndex]]).toFixed(1);

  palette.scale = newLightnessScale
};

export default shiftRightStop