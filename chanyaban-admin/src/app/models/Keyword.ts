import { BaseModel } from './BaseModel';

export class Keyword extends BaseModel {  
  public name: string;
  public details: any; 
  public isTag: boolean;
  public status: "unclassified"| "permanent" | "common" | "banned";
}