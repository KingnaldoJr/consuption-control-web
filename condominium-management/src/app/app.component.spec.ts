import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser'; // For querying elements

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // AppComponent is standalone, so it's in imports.
      // RouterTestingModule is needed because AppComponent's template uses router directives.
      imports: [AppComponent, RouterTestingModule], 
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'condominium-management' title property`, () => { // Clarified test name
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('condominium-management');
  });

  it('should have the currentYear property set to the current year', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.currentYear).toEqual(new Date().getFullYear());
  });

  it('should render the main application title in the header', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // The new HTML has <h1>Condominium Management</h1> in the header
    const headerTitle = compiled.querySelector('.app-header h1');
    expect(headerTitle?.textContent).toContain('Condominium Management');
  });

  it('should render navigation links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.main-nav ul li a');
    expect(navLinks.length).toBe(2); // Check for two navigation links
    expect(navLinks[0]?.textContent).toContain('Dashboard');
    expect(navLinks[0]?.getAttribute('href')).toBe('/dashboard');
    expect(navLinks[1]?.textContent).toContain('Add New Usage Data');
    expect(navLinks[1]?.getAttribute('href')).toBe('/data-entry');
  });

  it('should render router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const routerOutletElement = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutletElement).not.toBeNull();
  });
});
