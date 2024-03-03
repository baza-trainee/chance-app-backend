import { registerDecorator, ValidationOptions } from 'class-validator';

export function MatchesCustom(
  regex: RegExp,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'matchesCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return new RegExp(regex).test(value);
        },
        defaultMessage() {
          return `Невалідне поле ${propertyName}`;
        },
      },
    });
  };
}
