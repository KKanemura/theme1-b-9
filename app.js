const availabilityForm = document.getElementById("availability-form");
const placeInput = document.getElementById("place-input");
const availableInput = document.getElementById("available-input");
const availabilityList = document.getElementById("availability-list");

const storageKey = "akaki-availability";

let availability = JSON.parse(localStorage.getItem(storageKey) ?? "[]");

function saveAvailability() {
  localStorage.setItem(storageKey, JSON.stringify(availability));
}

function renderAvailability() {
  availabilityList.replaceChildren();

  availability.forEach((item) => {
    const card = document.createElement("article");

    const place = document.createElement("h3");
    place.textContent = item.place;

    const count = document.createElement("p");
    count.textContent = `空席数：${item.count}席`;

    const time = document.createElement("small");
    time.textContent = `更新：${item.updatedAt}`;

    card.append(place, count, time);
    availabilityList.append(card);
  });
}

availabilityForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const place = placeInput.value.trim();
  const count = Number(availableInput.value);

  if (place === "" || availableInput.value === "" || count < 0) {
    return;
  }

  const existingIndex = availability.findIndex((item) => item.place === place);
  const updatedItem = {
    place,
    count,
    updatedAt: new Date().toLocaleString("ja-JP")
  };

  if (existingIndex === -1) {
    availability.push(updatedItem);
  } else {
    availability[existingIndex] = updatedItem;
  }

  saveAvailability();
  renderAvailability();
  placeInput.value = "";
  availableInput.value = "";
  placeInput.focus();
});

renderAvailability();
