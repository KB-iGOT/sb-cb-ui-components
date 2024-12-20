export interface IImageCarouselStyle {
  bannerMetaClass?: "inline-meta", 
  bannerMetaAlign?: "right" | "left",
  navigationArrows?: "hidden" | "visible",
  dots?: "hidden" | "visible",
  borderRadius?: string,
  customHeight?: string,
  arrowsPlacement?: "bottom-right" | "bottom-center" | "bottom-left" | "middle-inline",
  imageBorderWidth: number
  imageBorderColor: string
  imageBorderStyle: string
  autoplay: boolean
  responsive: {
    bannerMetaClass?: "inline-meta", 
    bannerMetaAlign?: "right" | "left",
    navigationArrows?: "hidden" | "visible",
    dots?: "hidden" | "visible",
    borderRadius?: string,
    customHeight?: string,
    arrowsPlacement?: "bottom-right" | "bottom-center" | "bottom-left" | "middle-inline",
    imageBorderWidth: number
    imageBorderColor: string
    imageBorderStyle: string
  }
}
