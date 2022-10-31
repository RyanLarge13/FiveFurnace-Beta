const form = document.querySelector("form");
const targetTechTime = document.getElementById("target");
const techTime = document.getElementById("tech-time");
//const currentTemp = document.getElementById("current-temp");
//const futureTemp = document.getElementById("future-temp");
const submit = document.querySelector("form button");
const output = document.querySelector(".output p");
const clear = document.querySelector(".clear");
const hearthCount = 4;
let cTemp;
let fTemp;

//need to convert times to seconds it is always the target techtime from your last tech time
// divid by 5 and then add that result to tempeture

class Seconds {
  constructor(elem) {
    this.elem = elem;
  }

  getValue() {
    return this.elem.value;
  }

  before() {
    return this.elem.substring(0, this.elem.indexOf(":"));
  }

  after() {
    return this.elem.substring(this.elem.indexOf(":") + 1);
  }

  toSeconds() {
    return this.elem * 60;
  }
}

const calc = (e) => {
  e.preventDefault();
  const minuteValue = new Seconds(targetTechTime).getValue();
  const secondsBefore = new Seconds(minuteValue).before();
  const minutesToSeconds = new Seconds(Number(secondsBefore)).toSeconds();
  const secondsValue = new Seconds(minuteValue).after();
  const totalSeconds = Number(secondsValue) + minutesToSeconds;
  calcCurrentTechTime(totalSeconds);
};

const calcCurrentTechTime = async (target) => {
  const minuteValue = new Seconds(techTime).getValue();
  const secondsBefore = new Seconds(minuteValue).before();
  const minutesToSeconds = new Seconds(Number(secondsBefore)).toSeconds();
  const secondsValue = new Seconds(minuteValue).after();
  const totalSeconds = Number(secondsValue) + minutesToSeconds;
  await getTemp();
  await getFutureTemp();
  const tempDiff = fTemp - cTemp;
  //const tempDiff = getTemp();
  convertToDegrees(target, totalSeconds, tempDiff);
};

const getTemp = async () => {
  /*const current = new Seconds(currentTemp).getValue();
    const future = new Seconds(futureTemp).getValue();
    return Number(future) - Number(current);*/
  const APIkey = "e942f755a159eeb9a8cff56a595afac5";
  const lat = "38";
  const lon = "-117";
  const units = "imperial";
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?&units=${units}&lat=${lat}&lon=${lon}&APPID=${APIkey}`
  )
    .then((res) => res.json())
    .then((data) => {
      cTemp = data.main.temp;
    })
    .catch((err) => console.log(err));
};

const getFutureTemp = async () => {
  const APIkey = "e942f755a159eeb9a8cff56a595afac5";
  const lat = "38";
  const lon = "-117";
  const units = "imperial";
  await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?units=${units}&lat=${lat}&lon=${lon}&appid=${APIkey}`
  )
    .then((res) => res.json())
    .then((data) => {
      const hour = new Date().getHours() - 1;
      fTemp = data.list[1].main.temp;
    })
    .catch((err) => console.log(err));
};

const convertToDegrees = (target, current, temp) => {
  const result = Math.floor(
    Number(((target - current) / 5).toFixed()) + Number(temp)
  );
  displayResult(result);
};

const displayResult = (result) => {
  if (result >= 0)
    output.innerHTML = `Increase the furnace by ${result} degrees.`;
  if (result < 0)
    output.innerHTML = `Decrease the furnace by ${result * -1} degrees`;
};

form.addEventListener("submit", calc);
clear.addEventListener("click", () => {
  form.reset();
  output.innerHTML = "";
});
