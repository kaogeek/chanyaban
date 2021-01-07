import { BaseModel } from './BaseModel';

export class News extends BaseModel { 
  public title: string; // source_type
  public sourceId: string; // ref
  public analyze: any; // string
  public content: any; // string
  public image: any; // string
  public postdate: Date; // string
}