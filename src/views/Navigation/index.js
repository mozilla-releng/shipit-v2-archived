import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

import CredentialsMenu from '../../views/CredentialsMenu';

export default function Navigation() {
  return (
    <div>
      <Navbar fluid inverse staticTop collapseOnSelect>
        <Nav pullRight>
          <CredentialsMenu />
        </Nav>
      </Navbar>
    </div>
  );
}
