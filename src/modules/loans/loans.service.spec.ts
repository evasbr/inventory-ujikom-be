import { Test, TestingModule } from '@nestjs/testing';
import { LoansService } from './loans.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as schema from '../../database/schema';

describe('LoansService', () => {
  let service: LoansService;
  let dbMock: any;

  beforeEach(async () => {
    // Mock untuk Drizzle Queries & Core API
    dbMock = {
      query: {
        inventory: { findFirst: jest.fn() },
        loans: { findFirst: jest.fn(), findMany: jest.fn() },
      },
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      // Mock Transaction: Menjalankan callback dengan mock DB itu sendiri
      transaction: jest.fn((callback) => callback(dbMock)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoansService,
        {
          provide: 'DB_CONNECTION',
          useValue: dbMock,
        },
      ],
    }).compile();

    service = module.get<LoansService>(LoansService);
  });

  describe('createRequest', () => {
    it('should throw NotFoundException if item does not exist', async () => {
      dbMock.query.inventory.findFirst.mockResolvedValue(null);

      await expect(
        service.createRequest({ inventoryId: 'uuid', borrowerName: 'User' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if item is not AVAILABLE', async () => {
      dbMock.query.inventory.findFirst.mockResolvedValue({
        status: 'BORROWED',
      });

      await expect(
        service.createRequest({ inventoryId: 'uuid', borrowerName: 'User' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a loan request successfully', async () => {
      dbMock.query.inventory.findFirst.mockResolvedValue({
        status: 'AVAILABLE',
      });
      dbMock.returning.mockResolvedValue([
        { id: 'loan-id', status: 'PENDING' },
      ]);

      const result = await service.createRequest({
        inventoryId: 'uuid',
        borrowerName: 'User',
      });

      expect(result).toEqual({ id: 'loan-id', status: 'PENDING' });
      expect(dbMock.insert).toHaveBeenCalled();
    });
  });

  describe('approveLoan', () => {
    it('should update inventory and loan status within a transaction', async () => {
      const mockLoan = {
        id: 'loan-1',
        inventoryId: 'inv-1',
        status: 'PENDING',
      };
      dbMock.query.loans.findFirst.mockResolvedValue(mockLoan);
      dbMock.returning.mockResolvedValue([{ ...mockLoan, status: 'BORROWED' }]);

      const result = await service.approveLoan('loan-1');

      expect(dbMock.transaction).toHaveBeenCalled();
      expect(dbMock.update).toHaveBeenCalledTimes(2); // Satu untuk inventory, satu untuk loan
      expect(result.status).toBe('BORROWED');
    });

    it('should throw error if loan is not PENDING', async () => {
      dbMock.query.loans.findFirst.mockResolvedValue({ status: 'RETURNED' });

      await expect(service.approveLoan('loan-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('returnItem', () => {
    it('should set item to AVAILABLE and loan to RETURNED', async () => {
      // PERBAIKAN: Ubah BORROWED menjadi ONGOING agar lolos validasi if di service
      const mockLoan = {
        id: 'loan-1',
        inventoryId: 'inv-1',
        status: 'ONGOING',
      };

      dbMock.query.loans.findFirst.mockResolvedValue(mockLoan);
      dbMock.returning.mockResolvedValue([{ ...mockLoan, status: 'RETURNED' }]);

      const result = await service.returnItem('loan-1');

      expect(dbMock.update).toHaveBeenCalledWith(schema.inventory);
      expect(result.status).toBe('RETURNED');
    });
  });
});
