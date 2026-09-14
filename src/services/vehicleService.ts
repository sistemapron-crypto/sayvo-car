import {
  collection,
  getDocs,
} from 'firebase/firestore';

import { db } from '../firebase/firestore';
import { Vehicle, VehicleFilters } from '../types/vehicle';
import { mapFirebaseProductToVehicle } from './vehicleMapper';

class VehicleService {
  /**
   * Busca os produtos diretamente do Firebase
   * e transforma os registros em veículos utilizados pelo novo front-end.
   */
  private async loadVehicles(): Promise<Vehicle[]> {
    const snapshot = await getDocs(collection(db, 'produtos'));

    const vehicles: Vehicle[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      const vehicle = mapFirebaseProductToVehicle({
        ...data,
        id: data.id ?? doc.id,
      });

      if (vehicle && vehicle.disponível) {
        vehicles.push(vehicle);
      }
    });

    return vehicles;
  }

  /**
   * Recupera os veículos disponíveis, aplicando os filtros.
   */
  async getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
    let result = await this.loadVehicles();

    if (!filters) {
      return result;
    }

    // Busca por marca, modelo ou versão
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();

      result = result.filter(
        (vehicle) =>
          vehicle.marca.toLowerCase().includes(q) ||
          vehicle.modelo.toLowerCase().includes(q) ||
          vehicle.versão.toLowerCase().includes(q)
      );
    }

    // Somente blindados
    if (filters.blindadoOnly) {
      result = result.filter((vehicle) => vehicle.blindado);
    }

    // Marcas
    if (filters.marcas && filters.marcas.length > 0) {
      result = result.filter((vehicle) =>
        filters.marcas.includes(vehicle.marca)
      );
    }

    // Preço mínimo
    if (filters.minPrice !== undefined) {
      result = result.filter(
        (vehicle) => vehicle.preço >= filters.minPrice!
      );
    }

    // Preço máximo
    if (filters.maxPrice !== undefined) {
      result = result.filter(
        (vehicle) => vehicle.preço <= filters.maxPrice!
      );
    }

    // Ano mínimo
    if (filters.minAno !== undefined) {
      result = result.filter(
        (vehicle) => vehicle.ano >= filters.minAno!
      );
    }

    // Ano máximo
    if (filters.maxAno !== undefined) {
      result = result.filter(
        (vehicle) => vehicle.ano <= filters.maxAno!
      );
    }

    // Combustível
    if (
      filters.combustível &&
      filters.combustível !== 'Todos'
    ) {
      result = result.filter(
        (vehicle) =>
          vehicle.combustível === filters.combustível
      );
    }

    // Transmissão
    if (
      filters.transmissão &&
      filters.transmissão !== 'Todas'
    ) {
      result = result.filter(
        (vehicle) =>
          vehicle.transmissão === filters.transmissão
      );
    }

    // Ordenação
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.preço - b.preço);
          break;

        case 'price_desc':
          result.sort((a, b) => b.preço - a.preço);
          break;

        case 'km_asc':
          result.sort(
            (a, b) => a.quilometragem - b.quilometragem
          );
          break;

        case 'year_desc':
          result.sort((a, b) => b.ano - a.ano);
          break;

        case 'recent':
          result.sort(
            (a, b) => Number(b.id) - Number(a.id)
          );
          break;

        default:
          break;
      }
    }

    return result;
  }

  /**
   * Busca um veículo específico pelo ID.
   */
  async getVehicleById(
    id: string
  ): Promise<Vehicle | null> {
    const vehicles = await this.loadVehicles();

    return (
      vehicles.find((vehicle) => vehicle.id === id) ||
      null
    );
  }

  /**
   * Busca veículos marcados como destaque.
   */
  async getFeaturedVehicles(): Promise<Vehicle[]> {
    const vehicles = await this.loadVehicles();

    return vehicles.filter((vehicle) => vehicle.destaque);
  }

  /**
   * Retorna as marcas disponíveis no estoque.
   */
  async getAvailableBrands(): Promise<
    { name: string; count: number }[]
  > {
    const vehicles = await this.loadVehicles();

    const brandsMap = new Map<string, number>();

    vehicles.forEach((vehicle) => {
      brandsMap.set(
        vehicle.marca,
        (brandsMap.get(vehicle.marca) || 0) + 1
      );
    });

    return Array.from(brandsMap.entries()).map(
      ([name, count]) => ({
        name,
        count,
      })
    );
  }

  /**
   * Retorna a quantidade de veículos disponíveis.
   */
  async getTotalVehiclesCount(): Promise<number> {
    const vehicles = await this.loadVehicles();

    return vehicles.length;
  }
}

export const vehicleService = new VehicleService();