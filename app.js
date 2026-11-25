const availabilityForm =
    document.getElementById("availability-form");

const placeInput =
    document.getElementById("place-input");

const availableInput =
    document.getElementById("available-input");

const availabilityList =
    document.getElementById("availability-list");

const usageValue =
    document.getElementById("usage-value");

const statusValue =
    document.getElementById("status-value");

const storageKey =
    "akaki-availability";

let availability =
    JSON.parse(
        localStorage.getItem(storageKey) ?? "[]"
    );

function getStatus(value) {

    value = Number(value);

    if (value >= 100) {
        return "満席";
    }

    if (value >= 70) {
        return "残りわずか";
    }

    return "空き";
}

function saveAvailability() {

    localStorage.setItem(
        storageKey,
        JSON.stringify(availability)
    );
}

function renderAvailability() {

    availabilityList.replaceChildren();

    availability.forEach((item) => {

        const card =
            document.createElement("article");

        const place =
            document.createElement("h3");

        place.textContent =
            item.place;

        const rate =
            document.createElement("p");

        rate.className = "rate";

        rate.textContent =
            `混雑率：${item.count}%`;

        const gauge =
            document.createElement("div");

        gauge.className = "gauge";

        const gaugeFill =
            document.createElement("div");

        gaugeFill.className =
            "gauge-fill";

        gaugeFill.style.width =
            `${item.count}%`;

        const status =
            document.createElement("p");

        status.className = "status";

        const currentStatus =
            getStatus(item.count);

        status.textContent =
            `空き状況：${currentStatus}`;

        if (currentStatus === "空き") {

            status.classList.add(
                "status-empty"
            );

            gaugeFill.classList.add(
                "gauge-empty"
            );

        } else if (
            currentStatus === "残りわずか"
        ) {

            status.classList.add(
                "status-limited"
            );

            gaugeFill.classList.add(
                "gauge-limited"
            );

        } else {

            status.classList.add(
                "status-full"
            );

            gaugeFill.classList.add(
                "gauge-full"
            );
        }

        gauge.append(gaugeFill);

        const time =
            document.createElement("small");

        time.textContent =
            `更新：${item.updatedAt}`;

        card.append(
            place,
            rate,
            gauge,
            status,
            time
        );

        availabilityList.append(card);
    });
}

function updateDisplay(value) {

    value = Number(value);

    usageValue.textContent =
        value + "%";

    const status =
        getStatus(value);

    statusValue.textContent =
        status;

    const gauge =
        document.getElementById(
            "live-gauge-fill"
        );

    if (!gauge) {
        return;
    }

    gauge.style.width =
        value + "%";

    gauge.classList.remove(
        "gauge-empty",
        "gauge-limited",
        "gauge-full"
    );

    if (status === "空き") {

        gauge.classList.add(
            "gauge-empty"
        );

    } else if (
        status === "残りわずか"
    ) {

        gauge.classList.add(
            "gauge-limited"
        );

    } else {

        gauge.classList.add(
            "gauge-full"
        );
    }
}

function showPage(pageId) {

    document.getElementById("menu-page")
        .style.display = "none";

    document.getElementById("check-page")
        .style.display = "none";

    document.getElementById("register-page")
        .style.display = "none";

    document.getElementById(pageId)
        .style.display = "block";

    if (pageId === "check-page") {
        renderAvailability();
    }
}

availableInput.addEventListener(
    "input",
    () => {
        updateDisplay(
            availableInput.value
        );
    }
);

availabilityForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const place =
            placeInput.value;

        const count =
            Number(
                availableInput.value
            );

        const existingIndex =
            availability.findIndex(
                item =>
                    item.place === place
            );

        const updatedItem = {
            place,
            count,
            updatedAt:
                new Date().toLocaleString("ja-JP")
        };

        if (
            existingIndex === -1
        ) {

            availability.push(
                updatedItem
            );

        } else {

            availability[
                existingIndex
            ] = updatedItem;
        }

        saveAvailability();

        alert(
            "空き状況を保存しました"
        );
    }
);

document
    .getElementById(
        "check-button"
    )
    .addEventListener(
        "click",
        () =>
            showPage(
                "check-page"
            )
    );

document
    .getElementById(
        "register-button"
    )
    .addEventListener(
        "click",
        () =>
            showPage(
                "register-page"
            )
    );

document
    .getElementById(
        "back-from-check"
    )
    .addEventListener(
        "click",
        () =>
            showPage(
                "menu-page"
            )
    );

document
    .getElementById(
        "back-from-register"
    )
    .addEventListener(
        "click",
        () =>
            showPage(
                "menu-page"
            )
    );

updateDisplay(0);
renderAvailability();