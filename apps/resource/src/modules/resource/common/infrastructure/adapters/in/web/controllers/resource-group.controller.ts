import { Controller, Get, Post, Delete, Body, Param, Patch, Query, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ApiDataResponse } from '@libs/decorators/api-responses.decorator';
import { CreateResourceGroupDto } from '@resource/modules/resource/common/application/dtos/create-resource.dto';
import {
    ResourceGroupResponseDto,
    ResourceGroupWithResourcesResponseDto,
} from '@resource/modules/resource/common/application/dtos/resource-response.dto';
import { UpdateResourceGroupDto } from '@resource/modules/resource/common/application/dtos/update-resource.dto';
import { Roles } from '@libs/decorators/role.decorator';
import { Role } from '@libs/enums/role-type.enum';
import { ResourceGroupUsecase } from '@resource/modules/resource/common/application/usecases/resource-group.usecase';
import { ResourceType } from '@libs/enums/resource-type.enum';
import { ResourceGroupService } from '../../../../../application/services/resource-group.service';
import { UpdateResourceGroupOrdersDto } from '@resource/modules/resource/common/application/dtos/update-resource.dto';

@ApiTags('자원 그룹')
@Controller('resource-groups')
@ApiBearerAuth()
export class ResourceGroupController {
    constructor(private readonly resourceGroupUsecase: ResourceGroupUsecase) {}

    @ApiTags('sprint0.1')
    @Get('parents')
    @Roles(Role.USER)
    @ApiOperation({ summary: '상위그룹 목록 조회 #사용자/자원구분/모달' })
    @ApiDataResponse({
        description: '상위 자원 그룹 목록을 조회했습니다.',
        type: [ResourceGroupResponseDto],
    })
    async findParentResourceGroups(): Promise<ResourceGroupResponseDto[]> {
        return this.resourceGroupUsecase.findParentResourceGroups();
    }

    @ApiTags('sprint0.1', 'sprint0.3')
    @Get('resources')
    @Roles(Role.USER)
    @ApiOperation({ summary: '상위그룹-하위그룹-자원 목록 조회 #사용자/자원선택/모달 #관리자/자원관리/자원목록' })
    @ApiDataResponse({
        description: '자원 그룹들과 각 그룹에 속한 자원 목록을 조회했습니다.',
        type: [ResourceGroupWithResourcesResponseDto],
    })
    @ApiQuery({ name: 'type', enum: ResourceType, required: false })
    async findAll(@Query('type') type: ResourceType): Promise<ResourceGroupWithResourcesResponseDto[]> {
        return this.resourceGroupUsecase.findResourceGroupsWithResourceData(type);
    }

    @ApiTags('sprint0.3')
    @Post()
    @Roles(Role.SYSTEM_ADMIN)
    @ApiOperation({ summary: '자원 그룹 생성' })
    @ApiDataResponse({
        status: 201,
        description: '자원 그룹이 생성되었습니다.',
        type: ResourceGroupResponseDto,
    })
    async create(@Body() createResourceGroupDto: CreateResourceGroupDto): Promise<ResourceGroupResponseDto> {
        return this.resourceGroupUsecase.createResourceGroup(createResourceGroupDto);
    }

    // 그룹 순서 변경
    @ApiTags('sprint0.3')
    @Patch('order')
    @Roles(Role.SYSTEM_ADMIN)
    @ApiOperation({ summary: '자원 그룹 순서 변경' })
    @ApiDataResponse({
        status: 200,
        description: '자원 그룹 순서가 성공적으로 변경되었습니다.',
    })
    async updateOrder(@Body() updateResourceGroupOrdersDto: UpdateResourceGroupOrdersDto) {
        return this.resourceGroupUsecase.reorderResourceGroups(updateResourceGroupOrdersDto);
    }

    @ApiTags('sprint0.3')
    @Patch(':resourceGroupId')
    @Roles(Role.SYSTEM_ADMIN)
    @ApiOperation({ summary: '자원 그룹 수정' })
    @ApiDataResponse({
        description: '자원 그룹이 수정되었습니다.',
        type: ResourceGroupResponseDto,
    })
    async update(
        @Param('resourceGroupId') resourceGroupId: string,
        @Body() updateResourceGroupDto: UpdateResourceGroupDto,
    ): Promise<ResourceGroupResponseDto> {
        return this.resourceGroupUsecase.updateResourceGroup(resourceGroupId, updateResourceGroupDto);
    }

    @ApiTags('sprint0.3')
    @Delete(':resourceGroupId')
    @Roles(Role.SYSTEM_ADMIN)
    @ApiOperation({ summary: '자원 그룹 삭제' })
    @ApiDataResponse({
        description: '자원 그룹이 삭제되었습니다.',
    })
    async remove(@Param('resourceGroupId') resourceGroupId: string): Promise<void> {
        return this.resourceGroupUsecase.deleteResourceGroup(resourceGroupId);
    }
}
