import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FitConfirmDialogComponent } from '../../shared/components/fit-confirm-dialog/fit-confirm-dialog.component'; 
import {
  DialogButton,
  DialogConfig,
  DialogType,
  DialogResult
} from '../../shared/models/dialog-config.model';

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
  imageUrl: string;

  // extra fields for modal (optional)
  engine?: string;
  drivetrain?: string;
  mpg?: string;
  seating?: number;
  exteriorColor?: string;
  interiorColor?: string;
  description?: string;
  features?: string[];
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
  exteriorColor: string;
  interiorColor: string;

  // step 4
  features: string; // comma separated in wizard
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
export class AdminInventoryManagementComponent implements OnInit, OnDestroy {
  constructor(private dialog: MatDialog) {}

  // filters / search
  query = '';
  selectedMake: string = 'all';
  selectedBodyType: string = 'all';
  selectedFuelType: string = 'all';
  selectedCondition: string = 'all';

  // options
  makeOptions: string[] = [];
  bodyTypeOptions: string[] = [];
  fuelTypeOptions: string[] = [];
  conditionOptions: VehicleCondition[] = ['New', 'Used'];

  // wizard state
  showAddWizard = false;
  wizardStep = 1;

  // Edit wizard state
  isEditMode = false;
  editingVehicleId: number | null = null;

  // view modal state
  showViewModal = false;
  selectedVehicle: Vehicle | null = null;

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
      engine: '3.0L Twin-Turbo I6',
      drivetrain: 'RWD',
      mpg: '16/23 MPG',
      seating: 5,
      exteriorColor: 'M Competition Blue',
      interiorColor: 'Merino Leather Black',
      description: 'Ultimate driving machine with track-proven performance.',
      features: ['M Sport Package', 'Carbon Fiber Trim', 'Harman Kardon Sound'],
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
      engine: 'Dual Motor (Electric)',
      drivetrain: 'AWD',
      mpg: '120/112 MPGe',
      seating: 5,
      exteriorColor: 'Pearl White Multi-Coat',
      interiorColor: 'Black',
      description: 'Fast, efficient, and minimalistic interior with great tech.',
      features: ['Autopilot', 'Glass Roof', 'Premium Audio'],
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
      engine: '3.0L Turbo I6 + EQ Boost',
      drivetrain: 'AWD',
      mpg: '20/28 MPG',
      seating: 5,
      exteriorColor: 'Obsidian Black',
      interiorColor: 'Nappa Leather Macchiato Beige',
      description: 'Flagship luxury sedan with cutting-edge comfort and tech.',
      features: ['Burmester Audio', 'Air Suspension', 'Massaging Seats'],
    },
  ];

  filteredVehicles: Vehicle[] = [];

  // form model
  newVehicle: NewVehicleForm = this.createEmptyForm();

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.showViewModal) this.closeViewModal();
  };

  ngOnInit(): void {
    this.rebuildFilterOptions();
    this.applyFilters();
    window.addEventListener('keydown', this.onKeyDown);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    document.body.classList.remove('inv-modal-open');
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
      const matchesBody = this.selectedBodyType === 'all' || v.bodyType === this.selectedBodyType;
      const matchesFuel = this.selectedFuelType === 'all' || v.fuelType === this.selectedFuelType;

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
  // Wizard (Add)
  // -----------------------------
  addVehicle(): void {
    this.isEditMode = false;
    this.editingVehicleId = null;

    this.showAddWizard = true;
    this.wizardStep = 1;
    this.newVehicle = this.createEmptyForm();

    setTimeout(() => {
      document.querySelector('.inv-wizard-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  // Wizard (Edit)
  editVehicle(v: Vehicle): void {
    this.isEditMode = true;
    this.editingVehicleId = v.id;

    this.showAddWizard = true;
    this.wizardStep = 1;

    this.newVehicle = {
      make: v.make ?? '',
      model: v.model ?? '',
      year: v.year ?? new Date().getFullYear(),
      price: v.price ?? 0,

      engine: v.engine ?? '',
      hp: v.hp ?? 0,
      transmission: v.transmission ?? 'Automatic',
      drivetrain: v.drivetrain ?? '',
      fuelType: v.fuelType ?? 'Gasoline',
      mpg: v.mpg ?? '',

      bodyType: v.bodyType ?? 'Sedan',
      miles: v.miles ?? 0,
      condition: v.condition ?? 'New',
      seating: v.seating ?? 5,
      exteriorColor: v.exteriorColor ?? '',
      interiorColor: v.interiorColor ?? '',

      features: (v.features ?? []).join(', '),
      description: v.description ?? '',
      status: v.status ?? 'In Stock',
      images: [],
    };

    setTimeout(() => {
      document.querySelector('.inv-wizard-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  closeWizard(): void {
    this.showAddWizard = false;
    this.wizardStep = 1;

    this.isEditMode = false;
    this.editingVehicleId = null;
    this.newVehicle = this.createEmptyForm();
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

    const featuresArr = this.parseFeatures(this.newVehicle.features);

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

      engine: this.newVehicle.engine?.trim(),
      drivetrain: this.newVehicle.drivetrain?.trim(),
      mpg: this.newVehicle.mpg?.trim(),
      seating: Number(this.newVehicle.seating) || 5,
      exteriorColor: this.newVehicle.exteriorColor?.trim(),
      interiorColor: this.newVehicle.interiorColor?.trim(),
      description: this.newVehicle.description?.trim(),
      features: featuresArr,
    };

    this.vehicles.unshift(vehicle);
    this.rebuildFilterOptions();
    this.applyFilters();
    this.closeWizard();
    this.showSuccessDialog(
    'Vehicle added successfully',
    'The vehicle has been successfully added to the inventory.');
  
  }

  // Update existing vehicle
  updateVehicle(): void {
    if (!this.isEditMode || this.editingVehicleId == null) return;

    const idx = this.vehicles.findIndex(x => x.id === this.editingVehicleId);
    if (idx < 0) return;

    const current = this.vehicles[idx];

    const coverUrl =
      this.newVehicle.images.length > 0
        ? URL.createObjectURL(this.newVehicle.images[0])
        : current.imageUrl;

    const featuresArr = this.parseFeatures(this.newVehicle.features);

    const updated: Vehicle = {
      ...current,
      make: this.newVehicle.make.trim(),
      model: this.newVehicle.model.trim(),
      year: Number(this.newVehicle.year) || current.year,
      price: Number(this.newVehicle.price) || 0,

      engine: this.newVehicle.engine?.trim(),
      hp: Number(this.newVehicle.hp) || 0,
      transmission: this.newVehicle.transmission,
      drivetrain: this.newVehicle.drivetrain?.trim(),
      fuelType: this.newVehicle.fuelType,
      mpg: this.newVehicle.mpg?.trim(),

      bodyType: this.newVehicle.bodyType,
      miles: Number(this.newVehicle.miles) || 0,
      condition: this.newVehicle.condition,
      seating: Number(this.newVehicle.seating) || 5,
      exteriorColor: this.newVehicle.exteriorColor?.trim(),
      interiorColor: this.newVehicle.interiorColor?.trim(),

      description: this.newVehicle.description?.trim(),
      features: featuresArr,
      status: this.newVehicle.status,
      imageUrl: coverUrl,
    };

    this.vehicles[idx] = updated;

    if (this.selectedVehicle?.id === updated.id) {
      this.selectedVehicle = updated;
    }

    this.rebuildFilterOptions();
    this.applyFilters();
    this.closeWizard();
    this.showSuccessDialog(
    'Vehicle updated successfully',
    'The vehicle details have been successfully updated.');

  }

  private parseFeatures(raw: string): string[] {
    return raw ? raw.split(',').map(x => x.trim()).filter(Boolean) : [];
  }

  // -----------------------------
  // View Modal
  // -----------------------------
  viewVehicle(v: Vehicle): void {
    this.selectedVehicle = v;
    this.showViewModal = true;
    document.body.classList.add('inv-modal-open');
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedVehicle = null;
    document.body.classList.remove('inv-modal-open');
  }

  // -----------------------------
  // Card actions
  // -----------------------------
  setStatus(v: Vehicle, status: VehicleStatus): void {
    v.status = status;
    this.applyFilters();
  }

  /**  Ovo je nova metoda: koristi shared FitConfirmDialogComponent */
  confirmDeleteVehicle(v: Vehicle): void {
    const dialogRef = this.dialog.open(FitConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: <DialogConfig>{
        type: DialogType.WARNING,
        title: 'Delete vehicle',
        message: 'Are you sure you want to delete this vehicle?\nThis action cannot be undone.',
        buttons: [
          { type: DialogButton.CANCEL, label: 'No, cancel' },
          { type: DialogButton.DELETE, label: 'Yes, delete' }
        ]
      }
    });

    dialogRef.afterClosed().subscribe((result: DialogResult) => {
      if (!result) return;
      if (result.button === DialogButton.DELETE) {
        this.deleteVehicle(v);
      }
    });
  }

  /* This is succes dialog pop up for add and edit wizard form! */
  private showSuccessDialog(title: string, message: string): void {
  this.dialog.open(FitConfirmDialogComponent, {
    width: '420px',
    data: <DialogConfig>{
      type: DialogType.SUCCESS,
      title,
      message,
      buttons: [
        { type: DialogButton.OK }
      ]
    }
  });
}


  /** Ostaje ista delete logika */
  private deleteVehicle(v: Vehicle): void {
    this.vehicles = this.vehicles.filter((x) => x.id !== v.id);
    this.rebuildFilterOptions();
    this.applyFilters();

    if (this.selectedVehicle?.id === v.id) {
      this.closeViewModal();
    }

    if (this.editingVehicleId === v.id) {
      this.closeWizard();
    }
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
      exteriorColor: '',
      interiorColor: '',

      features: '',
      description: '',
      status: 'In Stock',
      images: [],
    };
  }
}
