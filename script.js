class Slide {
  constructor(slide, container){
    this.slide = document.querySelector(slide);
    this.container = document.querySelector(container);
    this.distances = {finalPosition: 0, startX: 0, movement: 0};
    this.changeEvent = new Event('changeEvent');
  }

  bindThis(){
    this.activeButtons = this.activeButtons.bind(this);
    this.eventControl = this.eventControl.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  moveSlide(distX){
    this.distances.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0px, 0px)`;
  }

  updatePosition(clientX){
    this.distances.movement = (this.distances.startX - clientX) * 1.6;
    return this.distances.finalPosition - this.distances.movement;
  }

  onStart(event){
    event.preventDefault();
    this.distances.startX = event.clientX;
    this.container.addEventListener('mousemove', this.onMove);
  }

  onEnd(){
    this.container.removeEventListener('mousemove', this.onMove);
    this.distances.finalPosition = this.distances.movePosition;
    this.changeSlideOnEnd();
  }

  onMove(event){
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  addEvents(){
    this.container.addEventListener('mousedown', this.onStart);
    this.container.addEventListener('mouseup', this.onEnd);
  }

  slidesIndexNav(index){
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    }
  }

  slidePosition(slide){
    const margin = (window.innerWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig(){
    this.slideArray = [...this.slide.children].map(element => {
      const position = this.slidePosition(element);
      return {position, element}
    });
  }

  changeSlide(index){
    [...this.slide.children].forEach(card => card.classList.remove('active'));;
    const activeSlide = this.slideArray[index];
    activeSlide.element.classList.add('active')
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.distances.finalPosition = activeSlide.position;
    this.container.dispatchEvent(this.changeEvent);
    this.slide.style.transition = `.4s`;

    this.container.addEventListener('changeEvent', this.activeButtons);
  }

  activePrevSlide(){
    if(this.index.prev !== undefined){
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide(){
    if(this.index.next !== undefined){
      this.changeSlide(this.index.next);
    }
  }

  changeSlideOnEnd(){
    if(this.distances.movement > 120 && this.index.next !== undefined){
      this.activeNextSlide();
    } else if(this.distances.movement < -120 && this.index.prev !== undefined){
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  createButtons(){
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('slide-buttons');
    this.slideArray.forEach((item, index) => {
      btnContainer.innerHTML += `
        <a href="#slidecard${index + 1}" class="button"></a>
      `
    })
    this.container.insertAdjacentElement('beforeend', btnContainer);
    return btnContainer;
  }

  eventControl(item, index){
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlide(index);
      this.activeButtons();
    })
  }

  addButtons(){
    this.buttons = this.createButtons();
    this.buttonsArray = [...this.buttons.children];
    this.buttonsArray.forEach(this.eventControl);
    this.activeButtons();
  }

  activeButtons(){
    this.buttonsArray.forEach(item => item.classList.remove('active'));
    this.buttonsArray.forEach(btn => btn.classList.remove('actived'));
    this.buttonsArray[this.index.active].classList.add('active');
    if(this.index.active !== 0){
      this.buttonsArray.slice(0, this.index.active + 1).forEach(btn => btn.classList.add('actived'))
    }
  }

  anime(){
    this.bindThis();
    this.slidesConfig();
    this.changeSlide(2);
    this.addButtons();
    this.addEvents();
    return this;
  }
}

const slide = new Slide('[data-js="slide"]', '[data-wrapper="slide-wrapper"]');
slide.anime();