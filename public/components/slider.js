class Slider extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'
    this.setAttribute("class", "slider");

    //props
    const min = parseFloat(this.getAttribute("min"));
    const max = parseFloat(this.getAttribute("max"));
    const minlabel = this.getAttribute("minlabel");
    const maxlabel = this.getAttribute("maxlabel");
    const label = this.getAttribute("label");
    const type = this.getAttribute("type");
    const unit = this.getAttribute("unit");

    //vars
    const parent = this;
    let isMouseDown = false;
    let mouseMoveListener = null;
    let value = min;

    //funcs
    function handleTooltip(percent) {
      value = parseInt(min + (max - min) * (percent / 100));
      console.log(value);
      let tooltipText = formatNumber(value);

      if (type === "currency") tooltipText = "$" + tooltipText;
      if (type === "percentage") tooltipText = parseInt(tooltipText) * 5 + "%";
      if (type === "unit" && unit) {
        tooltipText = tooltipText + " " + unit;
        if (value !== 1) tooltipText = tooltipText + "s";
      }

      tooltip.innerText = tooltipText;
    }

    function moveThumb(event) {
      const trackOffset = event.pageX - track.offsetLeft;
      let thumbPos = parseInt((trackOffset / track.offsetWidth) * 100);
      thumbPos = Math.max(0, Math.min(thumbPos, 100));
      handleTooltip(thumbPos);
      style.textContent = `.slider__thumb { left: calc(${thumbPos}% - 8px) } .slider__tooltip { display: ${
        value ? "block" : "none"
      }}`;

      parent.dispatchEvent(
        new CustomEvent("slider-changed", {
          bubbles: true,
          composed: true,
          detail: { value, type },
        })
      );
    }

    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const track = document.createElement("div");
    track.setAttribute("class", "slider__track");

    const thumb = document.createElement("div");
    thumb.setAttribute(
      "class",
      `slider__thumb slider__thumb-${type === "currency" ? "icon" : "dot"}`
    );
    track.appendChild(thumb);

    const tooltip = document.createElement("div");
    tooltip.setAttribute("class", "slider__tooltip");
    thumb.appendChild(tooltip);

    const labels = document.createElement("div");
    labels.setAttribute("class", "slider__labels");
    labels.innerHTML = `<div>${minlabel}</div><div>${label}</div><div>${maxlabel}</div>`;

    const linkStyle = document.createElement("link");
    linkStyle.setAttribute("rel", "stylesheet");
    linkStyle.setAttribute("href", "styles/style.css");

    const style = document.createElement("style");
    style.textContent = `.slider__thumb { left: 0 } .slider__tooltip { display: ${
      value ? "block" : "none"
    }`;

    track.addEventListener("mousedown", (event) => {
      isMouseDown = true;
      mouseMoveListener = document.addEventListener("mousemove", moveThumb);
      moveThumb(event);
    });

    document.addEventListener("mouseup", (event) => {
      isMouseDown = false;
      document.removeEventListener("mousemove", moveThumb);
    });

    handleTooltip(0);
    this.shadowRoot.append(linkStyle, style, track, labels);
  }
}

customElements.define("custom-slider", Slider);
