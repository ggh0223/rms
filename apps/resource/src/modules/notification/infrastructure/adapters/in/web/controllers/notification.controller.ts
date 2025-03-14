import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Patch, Param, Body, Delete, Query } from '@nestjs/common';
import { User } from '@libs/decorators/user.decorator';
import { User as UserEntity } from '@libs/entities';
import { NotificationUsecase } from '@resource/modules/notification/application/usecases/notification.usecase';
import { ApiDataResponse } from '@libs/decorators/api-responses.decorator';

import { PushSubscriptionDto } from '@resource/modules/notification/application/dto/push-subscription.dto';
import { ResponseNotificationDto } from '@resource/modules/notification/application/dto/response-notification.dto';
import { NotificationType } from '@libs/enums/notification-type.enum';
import { SendNotificationDto } from '@resource/modules/notification/application/dto/create-notification.dto';
import { ResourceType } from '@libs/enums/resource-type.enum';

@ApiTags('알림')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationController {
    constructor(private readonly notificationUsecase: NotificationUsecase) {}

    @ApiTags('sprint0.3')
    @Post('subscribe')
    @ApiOperation({ summary: '웹 푸시 구독' })
    @ApiDataResponse({
        status: 200,
        description: '웹 푸시 구독 성공',
    })
    async subscribe(@User() user: UserEntity, @Body() subscription: PushSubscriptionDto): Promise<void> {
        await this.notificationUsecase.subscribe(user, subscription);
    }

    @ApiTags('sprint0.3')
    @Post('unsubscribe')
    @ApiOperation({ summary: '웹 푸시 구독 취소' })
    @ApiDataResponse({
        status: 200,
        description: '웹 푸시 구독 취소 성공',
    })
    async unsubscribe(@User() user: UserEntity) {
        await this.notificationUsecase.unsubscribe(user);
    }

    @ApiTags('sprint0.3')
    @Post('send')
    @ApiOperation({ summary: '웹 푸시 알림 전송' })
    @ApiDataResponse({
        status: 200,
        description: '웹 푸시 알림 전송 성공',
    })
    async send(@Body() sendNotificationDto: SendNotificationDto) {
        await this.notificationUsecase.createNotification(
            sendNotificationDto.notificationType,
            sendNotificationDto.notificationData,
            sendNotificationDto.notificationTarget,
        );
    }

    @ApiTags('sprint0.3')
    @Get()
    @ApiOperation({ summary: '알람 목록 조회' })
    @ApiDataResponse({
        status: 200,
        description: '알람 목록 조회 성공',
        type: [ResponseNotificationDto],
    })
    async findAllByEmployeeId(@User('employeeId') employeeId: string): Promise<ResponseNotificationDto[]> {
        return await this.notificationUsecase.findMyNotifications(employeeId);
    }

    @ApiTags('sprint0.3')
    @Patch(':notificationId/read')
    @ApiOperation({ summary: '알람 읽음 처리' })
    async markAsRead(@User() user: UserEntity, @Param('notificationId') notificationId: string) {
        await this.notificationUsecase.markAsRead(user.employeeId, notificationId);
    }

    // @ApiTags('sprint0.3-')
    // @Patch(':notificationId/unread')
    // @ApiOperation({ summary: '알람 읽지 않음 처리' })
    // async markAsUnread(@Param('notificationId') notificationId: string) {
    //     // await this.notificationService.markAsUnread(id);
    // }

    // @ApiTags('sprint0.3-')
    // @Patch(':employeeId/readAll')
    // @ApiOperation({ summary: '모든 알람 읽음 처리' })
    // async markAllAsRead(@Param('employeeId') employeeId: string) {
    //     // await this.notificationService.markAllAsRead();
    // }
}
