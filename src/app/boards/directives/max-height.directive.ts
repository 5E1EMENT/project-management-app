import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

const footerSize = 120;

@Directive({
  selector: '[appMaxHeight]',
})
export class MaxHeightDirective implements AfterViewInit, OnDestroy {
  private container: HTMLElement;
  private resizeSub: Subscription;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this.container = this.elementRef.nativeElement as HTMLElement;

    this.resizeSub = fromEvent(window, 'resize')
      .pipe(throttleTime(500), debounceTime(500))
      .subscribe(() => this.setHeight());
  }

  ngAfterViewInit() {
    this.setHeight();
  }

  ngOnDestroy() {
    this.resizeSub.unsubscribe();
  }

  private setHeight() {
    const windowHeight = window?.innerHeight;
    const topOffset = this.calcTopOffset();
    let height = windowHeight - topOffset - footerSize;

    this.renderer.setStyle(this.container, 'height', `${height}px`);
  }

  private calcTopOffset(): number {
    return this.container.getBoundingClientRect().top;
  }
}
