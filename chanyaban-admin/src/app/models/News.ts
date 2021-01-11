/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { BaseModel } from './BaseModel';

export class News extends BaseModel {
  public title: string; // source_type
  public sourceId: string; // ref
  public analyze: any; // string
  public content: any; // string
  public image: any; // string
  public postdate: Date; // string
}