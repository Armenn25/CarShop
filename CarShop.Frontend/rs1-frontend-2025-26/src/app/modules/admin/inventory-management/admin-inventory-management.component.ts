import { Component, OnInit } from '@angular/core';

type VehicleStatus = 'In Stock' | 'Limited' | 'Sold';
type VehicleCondition = 'New' | 'Used';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  condition: VehicleCondition;
  bodyType: string;
  fuelType: string;
  transmission: string;
  hp: number;
  miles: number;
  price: number;
  status: VehicleStatus;
  imageUrl: string; // cover image for cards
}

interface NewVehicleForm {
  make: string;
  model: string;
  year: number;
  price: number;

  // step 2
  engine: string;
  hp: number;
  transmission: string;
  drivetrain: string;
  fuelType: string;
  mpg: string;

  // step 3
  bodyType: string;
  miles: number;
  condition: VehicleCondition;
  seating: number;
  color: string;
  exteriorColor: string;
  interiorColor: string;

  // step 4
  features: string;
  description: string;
  status: VehicleStatus;
  images: File[];
}

@Component({
  selector: 'app-admin-inventory-management',
  standalone: false,
  templateUrl: './admin-inventory-management.component.html',
  styleUrls: ['./admin-inventory-management.component.scss'],
})
export class AdminInventoryManagementComponent implements OnInit {
  // filters / search
  query = '';
  selectedMake: string = 'all';
  selectedBodyType: string = 'all';
  selectedFuelType: string = 'all';
  selectedCondition: string = 'all';

  // options (used in HTML)
  makeOptions: string[] = [];
  bodyTypeOptions: string[] = [];
  fuelTypeOptions: string[] = [];
  conditionOptions: VehicleCondition[] = ['New', 'Used'];

  // wizard state
  showAddWizard = false;
  wizardStep = 1;

  // data
  vehicles: Vehicle[] = [
    {
      id: 1,
      make: 'BMW',
      model: 'M3',
      year: 2024,
      condition: 'New',
      bodyType: 'Sedan',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      hp: 503,
      miles: 12,
      price: 75990,
      status: 'In Stock',
      imageUrl: 'assets/cars/demo-1.jpg',
    },
    {
      id: 2,
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      condition: 'New',
      bodyType: 'Sedan',
      fuelType: 'Electric',
      transmission: 'Automatic',
      hp: 346,
      miles: 5,
      price: 42990,
      status: 'In Stock',
      imageUrl: 'assets/cars/demo-2.jpg',
    },
    {
      id: 3,
      make: 'Mercedes-Benz',
      model: 'S-Class',
      year: 2024,
      condition: 'New',
      bodyType: 'Sedan',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      hp: 429,
      miles: 8,
      price: 118900,
      status: 'Limited',
      imageUrl: 'assets/cars/demo-3.jpg',
    },
  ];

  filteredVehicles: Vehicle[] = [];

  // form model
  newVehicle: NewVehicleForm = this.createEmptyForm();

  ngOnInit(): void {
    this.rebuildFilterOptions();
    this.applyFilters();
  }

  // -----------------------------
  // Filters
  // -----------------------------
  applyFilters(): void {
    const q = this.query.trim().toLowerCase();

    this.filteredVehicles = this.vehicles.filter((v) => {
      const matchesQuery =
        !q || `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(q);

      const matchesMake = this.selectedMake === 'all' || v.make === this.selectedMake;
      const matchesBody =
        this.selectedBodyType === 'all' || v.bodyType === this.selectedBodyType;
      const matchesFuel =
        this.selectedFuelType === 'all' || v.fuelType === this.selectedFuelType;

      const matchesCond =
        this.selectedCondition === 'all' ||
        v.condition === (this.selectedCondition as VehicleCondition);

      return matchesQuery && matchesMake && matchesBody && matchesFuel && matchesCond;
    });
  }

  resetFilters(): void {
    this.query = '';
    this.selectedMake = 'all';
    this.selectedBodyType = 'all';
    this.selectedFuelType = 'all';
    this.selectedCondition = 'all';
    this.applyFilters();
  }

  private rebuildFilterOptions(): void {
    this.makeOptions = this.unique(this.vehicles.map((x) => x.make));
    this.bodyTypeOptions = this.unique(this.vehicles.map((x) => x.bodyType));
    this.fuelTypeOptions = this.unique(this.vehicles.map((x) => x.fuelType));
  }

  private unique(arr: string[]): string[] {
    return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
  }

  // -----------------------------
  // Wizard
  // -----------------------------
  addVehicle(): void {
    this.showAddWizard = true;
    this.wizardStep = 1;
    this.newVehicle = this.createEmptyForm();

    setTimeout(() => {
      document
        .querySelector('.inv-wizard-card')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  closeWizard(): void {
    this.showAddWizard = false;
  }

  nextStep(): void {
    if (this.wizardStep < 4) this.wizardStep++;
  }

  prevStep(): void {
    if (this.wizardStep > 1) this.wizardStep--;
  }

  onImagesSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    this.newVehicle.images = files;
  }

  saveNewVehicle(): void {
    const id = Date.now();

    const coverUrl =
      this.newVehicle.images.length > 0
        ? URL.createObjectURL(this.newVehicle.images[0])
        : 'assets/cars/demo-1.jpg';

    const vehicle: Vehicle = {
      id,
      make: this.newVehicle.make.trim(),
      model: this.newVehicle.model.trim(),
      year: Number(this.newVehicle.year) || new Date().getFullYear(),
      condition: this.newVehicle.condition,
      bodyType: this.newVehicle.bodyType,
      fuelType: this.newVehicle.fuelType,
      transmission: this.newVehicle.transmission,
      hp: Number(this.newVehicle.hp) || 0,
      miles: Number(this.newVehicle.miles) || 0,
      price: Number(this.newVehicle.price) || 0,
      status: this.newVehicle.status,
      imageUrl: coverUrl,
    };

    this.vehicles.unshift(vehicle);
    this.rebuildFilterOptions();
    this.applyFilters();
    this.closeWizard();
  }

  // -----------------------------
  // Card actions (FIX for your errors)
  // -----------------------------
  viewVehicle(v: Vehicle): void {
    console.log('View vehicle', v.id);
    // kasnije: router navigate ili modal
    // this.router.navigate(['/admin/inventory', v.id]);
  }

  markSold(v: Vehicle): void {
    v.status = 'Sold';
    this.applyFilters();
  }

  deleteVehicle(v: Vehicle): void {
    this.vehicles = this.vehicles.filter((x) => x.id !== v.id);
    this.rebuildFilterOptions();
    this.applyFilters();
  }

  // -----------------------------
  // UI helpers
  // -----------------------------
  badgeClass(status: VehicleStatus): string {
    return status === 'In Stock' ? 'ok' : status === 'Limited' ? 'warn' : 'bad';
  }

  private createEmptyForm(): NewVehicleForm {
    return {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,

      engine: '',
      hp: 0,
      transmission: 'Automatic',
      drivetrain: '',
      fuelType: 'Gasoline',
      mpg: '',

      bodyType: 'Sedan',
      miles: 0,
      condition: 'New',
      seating: 5,
      color: '',
      exteriorColor: '',
      interiorColor: '',

      features: '',
      description: '',
      status: 'In Stock',
      images: [],
    };
  }
}
