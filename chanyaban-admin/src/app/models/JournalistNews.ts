import { BaseModel } from './BaseModel';

export class JournalistNews extends BaseModel { 
  public journalistId: string; // source_type
  public newsId: number; // ref
  public analyze: any; // string
}
