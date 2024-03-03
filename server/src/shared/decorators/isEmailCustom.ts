import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsEmailCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEmailCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (
            !value ||
            !value.match(/^[A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{2,}\.[A-Za-z]{2,4}$/) ||
            value.endsWith('.ru') ||
            value.endsWith('.by') ||
            value.endsWith('.рф')
          ) {
            return false;
          }
          return true;
        },
        defaultMessage() {
          return 'Невірний формат електронної пошти';
        },
      },
    });
  };
}
