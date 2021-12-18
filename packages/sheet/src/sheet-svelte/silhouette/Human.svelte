<script lang="ts">
  import { Rectangle } from "dom-utils";
  import { HitLocation } from "gurpsjs";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import Popper from "../shared/Popper.svelte";
  import Arms from "./parts/Arms.svelte";
  import Legs from "./parts/Legs.svelte";
  import Head from "./parts/Head.svelte";
  import Torso from "./parts/Torso.svelte";
  let silhouette: SVGSVGElement | undefined;
  export let locations: HitLocation[] = [];
  export let height: string | undefined = undefined;
  export let width: string | undefined = undefined;
  export let maxHeight = "initial";
  export let minWidth = "initial";
  export let viewBox: ViewBox = [0, 0, 800, 800];
  type ViewBox = [x: number, y: number, height: number, width: number];
  const area = tweened(viewBox, { easing: cubicInOut, duration: 370 });
  const viewArea = derived(area, (v) => v.join(" "));
  $: area.set(viewBox);
  export let scale = 1;
  export let style = "";
  let originalView = viewBox;
  function revertViewbox() {
    if (!silhouette) return;
    showAll();
    focusLocation("");
    viewBox = originalView;
  }
  function frameInViewbox(svg: SVGGraphicsElement, scale: number) {
    if (!silhouette) return;
    const viewport = svg.viewportElement;
    if (!(viewport instanceof SVGSVGElement)) return;
    const viewRect = Rectangle.from(silhouette.viewBox.animVal);
    let { x, y, height: h, width: w } = Rectangle.from(svg.getBBox());
    scale = (viewRect.height / h) * scale;
    let width = viewRect.width / scale;
    let height = viewRect.height / scale;
    let xStart = x - width / 2;
    let yStart = y - height / 2;
    xStart += w / 2;
    yStart += h / 2;
    const newViewBox: ViewBox = [xStart, yStart, width, height];
    viewBox = newViewBox;
  }
  function getAllLocations() {
    return silhouette?.querySelectorAll<SVGElement>("[data-location-group]");
  }
  let focusedLocation = "";
  function focusLocation(location: string) {
    getAllLocations()?.forEach((svg) => {
      if (svg.dataset.locationGroup === location) {
        svg.classList.add("focused");
      } else {
        svg.classList.remove("focused");
      }
    });
    focusedLocation = location;
  }
  function hideAll(except: string[] = []) {
    getAllLocations()?.forEach((svg) => {
      const location = svg.dataset.locationGroup;
      if (!location) return;
      if (except.includes(location)) {
        //@ts-ignore
        svg.style.display = null;
      } else {
        svg.style.display = "none";
      }
    });
  }
  function showAll() {
    getAllLocations()?.forEach((svg) => {
      //@ts-ignore
      svg.style.display = null;
    });
  }
  function handleClick(this: SVGGraphicsElement, e: MouseEvent) {
    const target = e.target as HTMLElement;
    const group = target.closest<SVGGraphicsElement>("[data-location-group]");
    if (group) {
      const location = group.dataset.locationGroup;
      if (!location) return;
      frameInViewbox(group, 0.7);
      hideAll([location]);
      focusLocation(location);
      tooltipPosition = undefined;
    }
  }
  function handleOutsideClick(e: MouseEvent) {
    const target = e.target as Element;
    if (!silhouette?.contains(target)) {
      focusedLocation = "";
      revertViewbox();
      focusedLocation = "";
    }
  }
  let location: HitLocation | undefined;
  let tooltipPosition: Rectangle | undefined;
  function handleMouseMove(this: SVGSVGElement, e: MouseEvent) {
    const target = e.target as Element;
    const locationElement = target.closest<SVGElement>("[data-location]");
    if (locationElement) {
      location = locations.find(
        (location) =>
          location.tableName.toLowerCase() === locationElement.dataset.location
      );
      tooltipPosition = Rectangle.from({
        x: e.clientX,
        y: e.clientY,
      });
    } else {
      tooltipPosition = undefined;
    }
  }
</script>

<svelte:window on:click|capture={handleOutsideClick} />
{#if tooltipPosition && location}
  <Popper referenceElement={tooltipPosition} offset={[16, 16]}>
    <div slot="popper">
      <slot name="tooltip" {location}>
        {location.id}
      </slot>
    </div>
  </Popper>
{/if}
<svg
  bind:this={silhouette}
  on:click={handleClick}
  on:mousemove={handleMouseMove}
  on:mouseleave={() => (tooltipPosition = undefined)}
  {height}
  {width}
  viewBox={$viewArea}
  style="
    min-width:{minWidth};
    max-height:{maxHeight};
    transition: scale({scale});
    xml:space='preserve';
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
    [data-location]:hover {
      fill: #4a5568;
      stroke: #4a5568;
    }
    [data-location-group].crippled),
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

<style>
  svg {
    @apply flex-1;
    fill: white;
    stroke: #4a5568;
    stroke-width: 2;
  }
</style>
