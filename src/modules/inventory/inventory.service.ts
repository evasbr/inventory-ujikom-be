import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ilike, eq, and, SQL } from 'drizzle-orm';
import * as schema from '../../database/schema';
import {
  CreateInventoryDto,
  FindAllInventoryDto,
  InventoryStatus,
  UpdateInventoryDto,
} from './inventory.dto';
import { DB_PROVIDER } from '../../database/db.provider';

@Injectable()
export class InventoryService {
  constructor(
    @Inject('DB_CONNECTION') private db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll(params: FindAllInventoryDto) {
    const { search, status } = params;
    const conditions: SQL[] = [];

    if (search) {
      conditions.push(ilike(schema.inventory.name, `%${search}%`));
    }

    if (status) {
      conditions.push(eq(schema.inventory.status, status as InventoryStatus));
    }

    return await this.db
      .select()
      .from(schema.inventory)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
  }

  async findOne(id: string) {
    const result = await this.db
      .select()
      .from(schema.inventory)
      .where(eq(schema.inventory.id, id));

    if (!result.length) {
      throw new NotFoundException('Barang tidak ditemukan');
    }
    return result[0];
  }

  async create(data: CreateInventoryDto) {
    const result = await this.db
      .insert(schema.inventory)
      .values({
        name: data.name,
        description: data.description,
        status: 'AVAILABLE',
      })
      .returning();

    return result[0];
  }

  async update(id: string, data: UpdateInventoryDto) {
    const result = await this.db
      .update(schema.inventory)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.inventory.id, id))
      .returning();

    if (!result.length) {
      throw new NotFoundException('Barang tidak ditemukan');
    }
    return result[0];
  }

  async updateStatus(id: string, status: InventoryStatus) {
    const result = await this.db
      .update(schema.inventory)
      .set({ status: status, updatedAt: new Date() })
      .where(eq(schema.inventory.id, id))
      .returning();

    if (!result.length) {
      throw new NotFoundException('Barang tidak ditemukan');
    }
    return result[0];
  }

  async remove(id: string) {
    const result = await this.db
      .delete(schema.inventory)
      .where(eq(schema.inventory.id, id))
      .returning();

    if (!result.length) {
      throw new NotFoundException('Barang tidak ditemukan');
    }
    return { message: 'Barang berhasil dihapus' };
  }
}
