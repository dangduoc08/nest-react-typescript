import {
  PipeTransform,
  Injectable
} from '@nestjs/common'

@Injectable()
export class TransformWebhookData implements PipeTransform {
  transform(value: Buffer | object) {
    if (Buffer.isBuffer(value)) {
      value = JSON.parse(value.toString())
    }
    return value
  }
}