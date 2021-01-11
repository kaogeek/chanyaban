/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { BaseModel } from './BaseModel';

export class Keyword extends BaseModel {  
  public name: string;
  public details: any; 
  public isTag: boolean;
  public status: "unclassified"| "permanent" | "common" | "banned";
}