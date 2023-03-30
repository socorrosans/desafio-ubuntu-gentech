class Slide {
  constructor(slide, container){
    this.slide = document.querySelector(slide);
    this.container = document.querySelector(container);
    this.eventControl = this.eventControl.bind(this);
    this.distances = {finalPosition: 0, startX: 0, movement: 0}
  }

  moveSlide(distX){
    this.distances.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0px, 0px)`;
  }

  updatePosition(clientX){
    this.distances.movement = this.distances.startX - clientX;
    return this.distances.finalPosition - this.distances.movement;
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
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.distances.finalPosition = activeSlide.position;
    this.slide.style.transition = `.4s`
  }

  createButtons(){
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('slide-buttons');
    this.slideArray.forEach((item, index) => {
      return btnContainer.innerHTML += `
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
    this.activeButtons();
  }

  addButtons(){
    this.buttons = this.createButtons();
    this.buttonsArray = [...this.buttons.children];
    this.buttonsArray.forEach(this.eventControl);
  }

  activeButtons(){
    this.buttonsArray.forEach(item => item.classList.remove('active'));
    this.buttonsArray[this.index.active].classList.add('active');
  }

  anime(){
    this.slidesConfig();
    this.changeSlide(2);
    this.addButtons();
    return this;
  }
}

const slide = new Slide('[data-js="slide"]', '[data-wrapper="slide-wrapper"]');
slide.anime();