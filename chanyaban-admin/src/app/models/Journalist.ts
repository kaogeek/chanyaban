/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import { BaseModel } from './BaseModel';

export class Journalist extends BaseModel {
  public source: string; // ref
  public image: string;
  public name: string;
  public detail: string;
  public grade: number;
}