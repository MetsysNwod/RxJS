/**import { fromEvent, throttleTime } from 'rxjs';*/
import { delay, filter, fromEvent, map,  tap } from "rxjs";
import { carFrom$, state$ } from "./utils/mockData";
import './styles/main.scss';
/**
 * Funcion principal
 */
(function(){


    /***
     * Zona declaracion de elementos
     */

    const modelTitle:HTMLElement = document.querySelector('.model-title');
    const modelSubTitle:HTMLElement = document.querySelector('.model-subtitle');
    const loadingLayer:HTMLElement = document.querySelector('.loading');
    const modelHighLight:HTMLElement = document.querySelector('.model-highlight');
    const modelColors: HTMLElement = document.querySelector(".model-colors");
    const carImage: HTMLElement = document.querySelector(".car-image");
    const listFeatures: HTMLElement = document.querySelector(".list-features");

    /**
     * logica
     */
    const source$ = carFrom$.pipe(
        delay(2500),
        tap(() => {
            loadingLayer.style.display = 'none'
        })
    );

    const colors$ = source$.pipe(
        map((allRaw) => {
          const mapColors = allRaw.colors.map((item: any) => {
              const isColor = (state$.getValue().color === item.name) ? 'active' : ''
            return `<span class="click-color ${item.name} ${isColor}"></span>`;
          });
    
          return mapColors;
        })
      );
    
    const colorsClick$ = fromEvent(modelColors, "click").pipe(
        tap(() => {
            modelColors.childNodes.forEach((colorChild:HTMLElement) => {
                const [,color] = colorChild.classList.toString().split(' ');//click-color, white
                carImage.classList.remove(color)
                colorChild.classList.remove('active')
            })
        }),
        map((colorEvent: MouseEvent) => colorEvent.target),
        filter((colorTarget: HTMLElement) => {
          const classList = colorTarget.classList.toString();
          return classList.includes("click-color");
        }),
        map((colorTarget: HTMLElement) => {
            colorTarget.classList.add('active')
            const [,color] = colorTarget.classList.toString().split(' ');//click-color, white
            return color
        })
      );

    const title$ = source$.pipe(map((all) => {
        return all.name.toUpperCase()
    }));

    const subtitle$ = source$.pipe(map((all) => {
        return all.description
    }));

    const highlight$ = source$.pipe(
        map((todaLaData) =>{
            const mapHighLigh = todaLaData.highlight.map((item:any) => {
                return `<div class="text-center">
                <div>
                  <h2>${item.amount}<small>${item.symbol}</small></h2>
                </div>
                <div><small class="text-muted d-flex d-flex-wrap box-feature">${item.short}</small></div>
              </div>`;
            })

            return mapHighLigh
        }));

    const features$ = source$.pipe(
      map((allRaw) => {
        const mapFeatures = allRaw.features.map((item:any) => {
          return `<ul>
          <li>${item}</li>
          </ul>`
        })

        return mapFeatures
      }));

    /**
     * Subscribe
     */

    title$.subscribe((title) => modelTitle.innerHTML = title);
    subtitle$.subscribe((subtitle) => modelSubTitle.innerHTML = subtitle);
    highlight$.subscribe((highlight) => modelHighLight.innerHTML = highlight.join(''));
    colors$.subscribe((colors) => (modelColors.innerHTML = colors.join("")));
    features$.subscribe((features) => (listFeatures.innerHTML = features.join("")));

    colorsClick$.subscribe((color: string) => {
          state$.next({color})
    });



  /**
   * State de la APP
   */

   state$.subscribe(({color}) => {
     
    carImage.classList.add(color)

    console.log('Este es el color del momento ',color)
})

})();