/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { BaseModel } from './BaseModel';

export class JournalistNews extends BaseModel {
  public journalistId: string; // source_type
  public newsId: number; // ref
  public analyze: any; // string
}
