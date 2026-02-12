import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBlockDto } from 'src/dto/create_block.dto';
import { BlockService } from 'src/services/block.service';
import { BlockChainService } from 'src/services/blockchain.service';
@ApiTags('Block')
@Controller('api/block')
export class BlockController {
  constructor(
    private readonly blockService: BlockService,
    private readonly blockchainService: BlockChainService,
) {}

  @Post()
  @ApiOperation({ summary: 'Thêm block mới vào blockchain' })
  @ApiResponse({
    status: 200,
    description: 'Block created and added successfully',
  })
  async createBlock(@Body() createBlockDto: CreateBlockDto) {
    try {
      const newBlock = await this.blockService.createBlock(createBlockDto);
      await this.blockchainService.addBlock(newBlock);
      return {
        success: true,
        message: 'Block created and added to blockchain',
        data: newBlock,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
