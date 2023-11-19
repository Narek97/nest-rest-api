import { Injectable } from '@nestjs/common';
import { RoleEnum } from '../../common/enums';
import { Role } from '../../database/models';

@Injectable()
export class RolesService {
  async getRoleByType(role: RoleEnum): Promise<Role> {
    return Role.findOne({
      where: {
        role,
      },
    });
  }

  // create(createRoleDto: CreateRoleDto) {
  //   return 'This action adds a new role';
  // }
  //
  // findAll() {
  //   return `This action returns all roles`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} role`;
  // }
  //
  // update(id: number, updateRoleDto: UpdateRoleDto) {
  //   return `This action updates a #${id} role`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} role`;
  // }
}
