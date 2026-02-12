import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlockChainService } from 'src/services/blockchain.service';
import { BlockService } from 'src/services/block.service';
import { CreateBlockDto } from 'src/dto/create_block.dto';

@ApiTags('Blockchain')
@Controller('api/blockchain')
export class BlockchainController {
  constructor(
    private readonly blockchainService: BlockChainService,
    private readonly blockService: BlockService,
  ) {}

  @Post('genesis-block')
  @ApiOperation({ summary: 'Tạo Genesis Block' })
  @ApiResponse({ status: 200, description: 'Genesis block created successfully' })
  async createGenesisBlock() {
    try {
      const genesisBlock = await this.blockchainService.createGenesisBlock();
      return {
        success: true,
        message: 'Genesis block created successfully',
        data: genesisBlock,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ blockchain' })
  @ApiResponse({ status: 200, description: 'Blockchain retrieved successfully' })
  async getBlockchain() {
    try {
      const blockchain = await this.blockchainService.getBlockchain();
      return {
        success: true,
        data: blockchain,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('validate')
  @ApiOperation({ summary: 'Xác thực blockchain' })
  @ApiResponse({ status: 200, description: 'Blockchain validation result' })
  async validateBlockchain() {
    try {
      const isValid = await this.blockchainService.validateBlockchain();
      return {
        success: true,
        isValid,
        message: 'Blockchain is valid',
      };
    } catch (error) {
      return {
        success: false,
        isValid: false,
        message: error.message,
      };
    }
  }

  @Get('latest-block')
  @ApiOperation({ summary: 'Lấy block mới nhất' })
  @ApiResponse({ status: 200, description: 'Latest block retrieved' })
  async getLatestBlock() {
    try {
      const latestBlock = await this.blockchainService.getLatestBlock();
      return {
        success: true,
        data: latestBlock,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

}
