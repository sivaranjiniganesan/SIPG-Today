import * as React from 'react';

export default function Cell(props: any) {
  return <div className={'cell' + (props.className || '')} id={props.id} />;
}
