import { useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const useLocoScrollTrigger = (start) => {
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (!start) return;
  
    const scrollEl = document.querySelector('.container');
    console.log(`:::: ScrollTrigger&Locomotive run!`)
    
    let locoScroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      multiplier: 0.24,
    });

    locoScroll.on('scroll', () => {

      localStorage.setItem('pos-scroll-y',locoScroll.scroll.instance.scroll.y/100)
      ScrollTrigger.update()
   

    });

    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(value) {
        if (locoScroll) {
          return arguments.length
            ? locoScroll.scrollTo(value, 0, 0)
            : locoScroll.scroll.instance.scroll.y;
        }
        return null;
      },
      scrollLeft(value) {
        if (locoScroll) {
          return arguments.length
            ? locoScroll.scrollTo(value, 0, 0)
            : locoScroll.scroll.instance.scroll.x;
        }
        return null;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      }
    });

    const lsUpdate = () => {
      if (locoScroll) {
        locoScroll.update()
      }
    };

    ScrollTrigger.addEventListener('refresh', lsUpdate);
    ScrollTrigger.refresh(true);

    console.log(`:::: ScrollTrigger&Locomotive complete!`)

    return () => {
   
      locoScroll.destroy();
      ScrollTrigger.removeEventListener('refresh', lsUpdate);
    };

    
  }, [start]);
};

export default useLocoScrollTrigger;