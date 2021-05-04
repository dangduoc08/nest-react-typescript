import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  UnprocessableEntityException
} from '@nestjs/common'
import {
  plainToClass
} from 'class-transformer'
import {
  validate,
  ValidationError
} from 'class-validator'

type DTO = unknown
@Injectable()
export class AppValidationPipe implements PipeTransform {
  public async transform(
    dto: DTO,
    { metatype }: ArgumentMetadata
  ): Promise<DTO> {
    const data = dto || {}
    if (!metatype || !this.validate(metatype)) {
      return data
    }
    const object = plainToClass(metatype, data)
    const errors = await validate(object)
    const hasError: boolean = errors.length > 0
    if (hasError) {
      throw new UnprocessableEntityException(this.concatErrorMessage('', errors)?.trimEnd())
    }
    return data
  }

  private validate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }

  private concatErrorMessage(message: string, errors: ValidationError[]): string {
    if (errors.length > 0) {
      errors.forEach(error => {
        if (error.children && error.children?.length > 0) {
          message += this.concatErrorMessage(message, error.children)
        }
        for (const validation in error.constraints) {
          message += `${error.constraints[validation]}; `
        }
      })
    }
    return message
  }
}