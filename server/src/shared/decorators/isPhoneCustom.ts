import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPhoneCustom(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'phoneCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const pattern = /^\+380[0-9]{9}$/gm
          return pattern.test(value)
        },
        defaultMessage() {
          return 'Має бути валідним номером';
        },
      },
    });
  };
}
