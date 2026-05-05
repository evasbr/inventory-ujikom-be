import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { NotFoundException } from '@nestjs/common';
import * as schema from '../../database/schema';

describe('InventoryService', () => {
  let service: InventoryService;
  let dbMock: any;

  beforeEach(async () => {
    // Inisialisasi Mock untuk Drizzle Chaining
    dbMock = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: 'DB_CONNECTION',
          useValue: dbMock,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all inventory items', async () => {
      const mockResult = [{ id: '1', name: 'Laptop' }];
      dbMock.returning.mockResolvedValue(mockResult);
      // Drizzle select/from/where returns the query object which is then awaited
      dbMock.where.mockResolvedValue(mockResult);

      const result = await service.findAll({
        search: 'Laptop',
        status: 'AVAILABLE',
      });

      expect(dbMock.select).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a single item if found', async () => {
      const mockItem = { id: '1', name: 'Laptop' };
      dbMock.where.mockResolvedValue([mockItem]);

      const result = await service.findOne('1');
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item not found', async () => {
      dbMock.where.mockResolvedValue([]);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new item', async () => {
      const dto = { name: 'Mouse', description: 'Wireless' };
      const mockCreated = { id: 'uuid', ...dto, status: 'AVAILABLE' };

      dbMock.returning.mockResolvedValue([mockCreated]);

      const result = await service.create(dto);
      expect(result).toEqual(mockCreated);
      expect(dbMock.insert).toHaveBeenCalledWith(schema.inventory);
    });
  });

  describe('update', () => {
    it('should update and return the item', async () => {
      const mockUpdated = { id: '1', name: 'New Name' };
      dbMock.returning.mockResolvedValue([mockUpdated]);

      const result = await service.update('1', { name: 'New Name' });
      expect(result).toEqual(mockUpdated);
    });

    it('should throw error if item to update not found', async () => {
      dbMock.returning.mockResolvedValue([]);
      await expect(service.update('999', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete item and return success message', async () => {
      dbMock.returning.mockResolvedValue([{ id: '1' }]);

      const result = await service.remove('1');
      expect(result).toEqual({ message: 'Barang berhasil dihapus' });
    });
  });
});
