import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';

import ChromeReaderIcon from '@material-ui/icons/ChromeReaderMode'
import ContactsIcon from '@material-ui/icons/ImportContacts';
import GroupIcon from '@material-ui/icons/GroupWork';

import { TwitterTimelineEmbed } from 'react-twitter-embed';

import PageHead from '../page-head';
import PageBody from '../page-body';

import BlogFeed from './blog';

import { wc } from '../../utils/webcomponent';

import './index.css';
import { isNil } from 'lodash-es';

const style = theme => (
  {
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      paddingBottom: '0.75rem'
    },
    body: {
      flexGrow: 1,
      marginTop: 0
    },
    evenColumns: {
      backgroundColor: 'none',
      padding: theme.spacing.unit * 3
    },
    oddColumns: {
      backgroundColor: grey[200],
      padding: theme.spacing.unit * 3
    },
    molecule: {
      width: '100%',
      height: theme.spacing.unit * 40,
      marginBottom: theme.spacing.unit * 3
    },
    columnTitle: {
      marginBottom: theme.spacing.unit * 3
    }
  }
)

let EmbeddedVideo = () => {
  return (
    <Card>
      <div className="intrinsic-container intrinsic-container-16x9">
        <iframe title="reproducible-quantum-chemistry" src="https://www.youtube.com/embed/31THsQEyjYQ" frameBorder="0" allowFullScreen></iframe>
      </div>
    </Card>
  );
}

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      molecules: {
        0: null,
        1: null
      },
      rotate: true,
      posts: null
    }
  }

  // Fake fetch of a molecule of the week
  componentDidMount() {
    const inchiKeys = [
      'RYYVLZVUVIJVGH-UHFFFAOYSA-N',
      'TYQCGQRIZGCHNB-DUZGATOHSA-N'
    ];

    for (let i = 0; i < inchiKeys.length; ++i) {
      fetch(`/api/v1/molecules/inchikey/${inchiKeys[i]}`)
      .then((res) => {
        if (res.status === 200) {
          res.json()
          .then((molecule) => {
            if (molecule && molecule.cjson) {
              this.setState((state, props) => {
                state.molecules[i] = molecule.cjson;
              });
            }
          });
        }
      });
    }

    fetch('https://blog.kitware.com/wp-json/wp/v2/posts?tags=12&per_page=4')
    .then((res) => {
      return res.json();
    })
    .then((posts) => {
      this.setState({...this.state, posts: posts});
    });
  }

  onMoleculeInteract() {
    if (this.state.rotate) {
      this.setState({...this.state, rotate: false});
    }
  }
  
  render = () => {
    const { classes } = this.props;
    const { molecules, rotate, posts } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <PageHead noOverlap>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography color="inherit" gutterBottom variant="display1">
                  Open Chemistry Data Platform
                </Typography>
                <Typography variant="title" paragraph color="inherit">
                  Prototype data server, online notebook, visualization, and analytics
                </Typography>
                <Typography color="inherit" gutterBottom variant="body2">
                  Welcome to the online home of the Open Chemistry Data Platform,
                  open source project, currently in beta, and deployed on AWS.
                  This project offers a powerful data server, using RESTful APIs,
                  using Python, CherryPy, Girder, and many other open source
                  projects.
                </Typography>
                <Typography color="inherit" gutterBottom variant="body2">
                  The screencast shows an early version of the platform executing
                  computational chemistry calculations using NWChem, with a
                  JupyterLab frontend, and a number of visualization/analytics
                  capabilites from 3DMol, vtk.js, and D3. Code for the platform
                  is hosted on <a href="https://github.com/openchemistry" target="_blank" rel="noopener noreferrer">GitHub</a>.
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <div>
                  <EmbeddedVideo/>
                </div>
              </Grid>
            </Grid>
          </PageHead>
        </div>
        <div className={classes.body}>
          <PageBody noOverlap>
          <Grid container style={{height: '100%'}} alignItems="stretch">
            <Grid item xs={12} md={4} className={classes.evenColumns}>
              <div className={classes.columnTitle}>
                <Typography gutterBottom variant="title" color="textSecondary">
                  <ContactsIcon />&nbsp;Blog
                </Typography>
              </div>
              <BlogFeed posts={posts} />
              <Button href="https://blog.kitware.com/tag/open-chemistry/" target="_blank">More posts</Button>
            </Grid>
            <Grid item xs={12} md={4} className={classes.oddColumns}>
              <div className={classes.columnTitle}>
                <Typography gutterBottom variant="title" color="textSecondary">
                  <ChromeReaderIcon />&nbsp;Feed
                </Typography>
              </div>
              <Paper>
                <TwitterTimelineEmbed
                  sourceType="profile"
                  screenName="openchem"
                  options={{height: 800}}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} className={classes.evenColumns}>
              <div className={classes.columnTitle}>
                <Typography variant="title" color="textSecondary">
                  <GroupIcon />&nbsp;Structures
                </Typography>
              </div>
              {Object.values(molecules).map((cjson, i) => {
                if (isNil(cjson)) {
                  return null;
                }
                return (
                  <Paper className={classes.molecule}
                    onMouseEnter={(e) => {this.onMoleculeInteract()}}
                    key={i}
                  >
                    {cjson &&
                    <oc-molecule
                      ref={wc(
                        {},
                        {
                          cjson,
                          rotate,
                          moleculeRenderer: 'moljs'
                        }
                      )}
                    />
                    }
                  </Paper>
                )
              })}
            </Grid>
          </Grid>
          </PageBody>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(Home);
