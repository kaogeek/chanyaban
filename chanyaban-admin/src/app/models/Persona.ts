import { BaseModel } from './BaseModel';

export class Persona extends BaseModel {  
  public name: String;
  public details: String;
  public personaType: String;
  public keywords: String[];
  public createdDate: Date;
  public modifiedDate: Date;
}