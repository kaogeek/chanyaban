/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { BaseModel } from './BaseModel';

export class NewsAgency extends BaseModel {
  public icon: string; // source_type
  public name: string; // source_type
  public grade: number; // ref
  public image: string; // string
  // public config_source_type: {
  //   data: 
  // }; // ref
}
