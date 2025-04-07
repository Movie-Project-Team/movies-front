import { useBreakpoints } from '@vueuse/core'

export default function useResponsive() {
  const breakpoints = useBreakpoints({
    mobile: 768, 
    tablet: 960,  
    desktop: 1540, 
  })

  const isMobile = breakpoints.smaller('mobile')                
  const isTablet = breakpoints.between('mobile', 'tablet')   
  const isLaptop = breakpoints.between('tablet', 'desktop') 
  const isDesktop = breakpoints.greater('desktop') 

  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    breakpoints,
  }
}
