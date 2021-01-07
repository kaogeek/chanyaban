import { BaseModel } from './BaseModel';

export class Journalist extends BaseModel { 
  public source: string; // ref
  public image: string;
  public name: string;
  public detail: string;
  public grade: number;
}