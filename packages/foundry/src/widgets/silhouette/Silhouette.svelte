<script>
  import Popper from "../../components/Popper.svelte"
  import { portal } from "../../components/Portal.svelte"
  import { derived } from "svelte/store"
  import { tweened } from "svelte/motion"
  import { cubicInOut } from "svelte/easing"
  import { Arms, Head, Legs, Torso } from "./parts/index.js"
  export let height = null
  export let maxHeight = null
  export let width = null
  export let minWidth = null
  export let viewBox = [0, 0, 800, 800]
  export let scale = 1
  export let style = ""
  export let locations = []
  let originalView = viewBox
  let silhouette
  let location
  let tooltipPosition
  let focusedLocation
  const area = tweened(viewBox, { easing: cubicInOut, duration: 370 })
  const viewArea = derived(area, (v) => v.join(" "))
  $: area.set(viewBox)
  function focus(location) {
    getAllLocations()?.forEach((svg) => {
      if (svg.dataset.locationGroup === location) {
        svg.classList.add("focused")
      } else {
        svg.classList.remove("focused")
      }
    })
    focusedLocation = location
  }
  function hide(...except) {
    getAllLocations()?.forEach((svg) => {
      const location = svg.dataset.locationGroup
      if (!location) return
      if (except.includes(location)) {
        svg.style.display = null
      } else {
        svg.style.display = "none"
      }
    })
  }
  function show(...except) {
    getAllLocations()?.forEach((svg) => {
      const location = svg.dataset.locationGroup
      if (!except.includes(location)) {
        svg.style.display = null
      }
    })
  }
  function getAllLocations() {
    return (
      Array.from(silhouette?.querySelectorAll("[data-location-group]")) ?? []
    )
  }
  function frame(svg, scale) {
    if (!silhouette) return
    const viewport = svg.viewportElement
    if (!(viewport instanceof SVGSVGElement)) return
    const viewRect = silhouette.viewBox.animVal
    let { x, y, height: h, width: w } = svg.getBBox()
    scale = (viewRect.height / h) * scale
    let width = viewRect.width / scale
    let height = viewRect.height / scale
    let xStart = x - width / 2
    let yStart = y - height / 2
    xStart += w / 2
    yStart += h / 2
    const newViewBox = [xStart, yStart, width, height]
    viewBox = newViewBox
  }
  function revert() {
    if (!silhouette) return
    show()
    focus("")
    viewBox = originalView
  }
  function windowClick(e) {
    const target = e.target
    if (!silhouette?.contains(target)) {
      focusedLocation = ""
      revert()
      focusedLocation = ""
    }
  }
  function svgClick(e) {
    const target = e.target
    const group = target.closest("[data-location-group]")
    if (group) {
      const location = group.dataset.locationGroup
      if (!location) return
      frame(group, 0.7)
      hide(location)
      focus(location)
      tooltipPosition = undefined
    }
  }

  function svgMouseMove(e) {
    const target = e.target
    const locationElement = target.closest("[data-location]")
    const locationName = locationElement?.dataset.location
    if (locationElement) {
      location = locations.find(
        (location) => location.tableName?.toLowerCase() === locationName
      )
      if (!tooltipPosition?.isSameNode?.(locationElement)) {
        tooltipPosition = locationElement
      }
    } else {
      tooltipPosition = undefined
    }
  }
</script>

<svelte:window on:click={windowClick} />
{#if tooltipPosition && locations && location}
  <Popper let:popper referenceElement={tooltipPosition} offset={[16, 16]}>
    <div use:portal={(node) => node.getRootNode()} use:popper>
      <slot name="tooltip" {location}>
        {location?.id}
      </slot>
    </div>
  </Popper>
{/if}
<svg
  bind:this={silhouette}
  on:click={svgClick}
  on:mousemove={svgMouseMove}
  {height}
  {width}
  viewBox={$viewArea}
  style="
    min-width:{minWidth};
    max-height:{maxHeight};
    transition: scale({scale});
    {style}
  "
  version="1.1"
  id="Layer_1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  x="0px"
  y="0px"
>
  <style>
    [data-location-group] {
      @apply transition-opacity duration-300;
    }
    [data-location] {
      fill: transparent;
      stroke: white;
    }
    [data-location="vitals"] {
      fill: #813e36;
      stroke: none;
    }
    [data-location]:hover {
      fill: white;
      opacity: 75%;
    }
    [data-location-group].crippled,
    [data-location].crippled {
      fill: red;
      stroke: #4a5568;
    }
    [data-location-group]:not(.focused) [data-location="vitals"] {
    }
  </style>
  <Head />
  <Torso />
  <Arms />
  <Legs />
</svg>
