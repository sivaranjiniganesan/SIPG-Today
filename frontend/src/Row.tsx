import * as React from 'react';

export default function Row(props:any) {
  return (
    <div className={'row' + (props.className || '')} id={props.id}>
      {props.children}
    </div>
  );
}
