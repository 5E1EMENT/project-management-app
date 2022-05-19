import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
@Directive({
  selector: '[appSticky]',
})
export class StickyDirective implements AfterViewInit, OnDestroy {
  private container: HTMLElement;
  private scrollSub: Subscription;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this.container = this.elementRef.nativeElement as HTMLElement;

    this.scrollSub = fromEvent(window, 'scroll').subscribe(() =>
      this.setSticky()
    );
  }

  ngAfterViewInit() {
    this.setSticky();
  }

  ngOnDestroy() {
    this.scrollSub.unsubscribe();
  }

  private setSticky() {
    const scrollHeight = window?.scrollY;
    if (scrollHeight > 0) {
      this.renderer.setStyle(this.container, 'position', 'sticky');
      this.renderer.setStyle(this.container, 'top', '0');
      this.renderer.setStyle(this.container, 'background', '#b1b0b0');
      this.renderer.setStyle(this.container, 'padding', '5px 15px');
    } else {
      this.renderer.setStyle(this.container, 'position', 'static');
      this.renderer.setStyle(this.container, 'top', '0');
      this.renderer.setStyle(this.container, 'background', '#fff');
      this.renderer.setStyle(this.container, 'padding', '15px');
    }
  }
}
