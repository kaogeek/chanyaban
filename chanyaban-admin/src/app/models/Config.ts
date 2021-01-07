import { BaseModel } from './BaseModel';

export class Config extends BaseModel {
  public name: string;
  public type: string;
  public value: string | number | boolean;
}