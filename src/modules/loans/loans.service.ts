import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../../database/schema';
import { RequestLoanDto } from './loans.dto';
import { DB_PROVIDER } from '../../database/db.provider';

@Injectable()
export class LoansService {
  constructor(
    @Inject('DB_CONNECTION') private db: NodePgDatabase<typeof schema>,
  ) {}

  async createRequest(data: RequestLoanDto) {
    const item = await this.db.query.inventory.findFirst({
      where: eq(schema.inventory.id, data.inventoryId),
    });

    if (!item) throw new NotFoundException('Barang tidak ditemukan');
    if (item.status !== 'AVAILABLE')
      throw new BadRequestException('Barang sedang tidak tersedia');

    const result = await this.db
      .insert(schema.loans)
      .values({
        inventoryId: data.inventoryId,
        borrowerName: data.borrowerName,
        notes: data.notes,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        status: 'PENDING',
      })
      .returning();

    return result[0];
  }

  async approveLoan(loanId: string) {
    return await this.db.transaction(async (tx) => {
      const loan = await tx.query.loans.findFirst({
        where: eq(schema.loans.id, loanId),
      });

      if (!loan) throw new NotFoundException('Data peminjaman tidak ditemukan');
      if (loan.status !== 'PENDING')
        throw new BadRequestException(
          'Hanya status PENDING yang bisa disetujui',
        );

      // Update Inventory jadi BORROWED
      await tx
        .update(schema.inventory)
        .set({ status: 'BORROWED', updatedAt: new Date() })
        .where(eq(schema.inventory.id, loan.inventoryId));

      // Update Loan jadi BORROWED
      const updated = await tx
        .update(schema.loans)
        .set({ status: 'ONGOING', updatedAt: new Date() })
        .where(eq(schema.loans.id, loanId))
        .returning();

      return updated[0];
    });
  }

  async rejectLoan(loanId: string) {
    return await this.db.transaction(async (tx) => {
      const loan = await tx.query.loans.findFirst({
        where: eq(schema.loans.id, loanId),
      });

      if (!loan) throw new NotFoundException('Data peminjaman tidak ditemukan');
      if (loan.status !== 'PENDING')
        throw new BadRequestException(
          'Hanya status PENDING yang bisa disetujui',
        );

      const updated = await tx
        .update(schema.loans)
        .set({ status: 'REJECTED', updatedAt: new Date() })
        .where(eq(schema.loans.id, loanId))
        .returning();

      return updated[0];
    });
  }

  // 3. Pengembalian Barang (Status jadi RETURNED & Update Inventory jadi AVAILABLE)
  async returnItem(loanId: string) {
    return await this.db.transaction(async (tx) => {
      const loan = await tx.query.loans.findFirst({
        where: eq(schema.loans.id, loanId),
      });

      if (!loan || loan.status !== 'ONGOING') {
        throw new BadRequestException(
          'Barang belum dipinjam atau data tidak ditemukan',
        );
      }

      // Kembalikan status barang
      await tx
        .update(schema.inventory)
        .set({ status: 'AVAILABLE', updatedAt: new Date() })
        .where(eq(schema.inventory.id, loan.inventoryId));

      // Update transaksi peminjaman
      const updated = await tx
        .update(schema.loans)
        .set({
          status: 'RETURNED',
          returnDate: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.loans.id, loanId))
        .returning();

      return updated[0];
    });
  }

  async findAll() {
    return await this.db.query.loans.findMany({
      with: { inventory: true },
    });
  }
}
