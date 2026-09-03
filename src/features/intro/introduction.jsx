import { useState } from 'react';

import Box from '@mui/material/Box';

import Button from '@mui/material/Button';

import Card from '@mui/material/Card';

import Dialog from '@mui/material/Dialog';

import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';

import Grid from '@mui/material/Grid';

import IconButton from '@mui/material/IconButton';

import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';

import { useTranslation } from 'react-i18next';



import MotionReveal from '@/components/MotionReveal';

import SectionHeading from '@/components/SectionHeading';



const FACT_KEYS = ['role', 'focus', 'tracking', 'languages'];



const PhotoPlaceholder = ({ label }) => (

  <Box

    aria-hidden="true"

    sx={(theme) => ({

      width: '100%',

      maxWidth: 280,

      aspectRatio: '4 / 5',

      borderRadius: `${theme.tokens.radius.lg}px`,

      border: `1px dashed ${theme.palette.divider}`,

      backgroundColor: 'background.paper',

      display: 'grid',

      placeItems: 'center',

      color: 'text.disabled',

      mx: 'auto',

    })}

  >

    <Stack alignItems="center" spacing={1}>

      <PersonOutlineRoundedIcon sx={{ fontSize: 48 }} />

      <Typography variant="caption" align="center">

        {label}

      </Typography>

    </Stack>

  </Box>

);



const Introduction = ({ intro }) => {

  const { t } = useTranslation();

  const [videoOpen, setVideoOpen] = useState(false);

  const videoUrl = intro?.link;



  return (

    <>

      <SectionHeading title={t('about.title')} subtitle={t('about.subtitle')} />



      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">

        <Grid size={{ xs: 12, md: 7 }}>

          <MotionReveal>

            <Stack spacing={2.5} sx={{ maxWidth: '62ch' }}>

              <Typography variant="body1" color="text.secondary">

                {t('about.p1')}

              </Typography>

              <Typography variant="body1" color="text.secondary">

                {t('about.p2')}

              </Typography>

              <Typography variant="body1" color="text.secondary">

                {t('about.p3')}

              </Typography>

            </Stack>



            <Grid container spacing={2} sx={{ mt: 4 }}>

              {FACT_KEYS.map((key) => (

                <Grid key={key} size={{ xs: 6, sm: 3 }}>

                  <Card variant="outlined" sx={{ height: '100%', borderColor: 'divider' }}>

                    <Stack spacing={0.5} sx={{ p: 2 }}>

                      <Typography variant="overline" color="text.secondary">

                        {t(`about.facts.${key}`)}

                      </Typography>

                      <Typography variant="subtitle2" color="text.primary">

                        {t(`about.facts.${key}_value`)}

                      </Typography>

                    </Stack>

                  </Card>

                </Grid>

              ))}

            </Grid>



            {videoUrl && (

              <Button

                variant="outlined"

                startIcon={<PlayCircleOutlineRoundedIcon />}

                onClick={() => setVideoOpen(true)}

                sx={{ mt: 4 }}

              >

                {t('about.watch')}

              </Button>

            )}

          </MotionReveal>

        </Grid>



        <Grid size={{ xs: 12, md: 5 }}>

          <MotionReveal delay={0.1}>

            <PhotoPlaceholder label={t('about.photo_placeholder')} />

          </MotionReveal>

        </Grid>

      </Grid>



      {videoUrl && (

        <Dialog

          open={videoOpen}

          onClose={() => setVideoOpen(false)}

          maxWidth="md"

          fullWidth

          aria-labelledby="about-video-title"

        >

          <DialogTitle id="about-video-title" sx={{ display: 'flex', alignItems: 'center', pr: 6 }}>

            {t('about.videoTitle')}

            <IconButton

              aria-label={t('portfolio.actions.close')}

              onClick={() => setVideoOpen(false)}

              sx={{ position: 'absolute', right: 8, top: 8 }}

            >

              <CloseRoundedIcon />

            </IconButton>

          </DialogTitle>

          <DialogContent sx={{ p: 0, aspectRatio: '16 / 9' }}>

            <Box

              component="iframe"

              src={videoUrl}

              title={t('about.videoTitle')}

              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

              allowFullScreen

              sx={{ width: '100%', height: '100%', border: 0 }}

            />

          </DialogContent>

        </Dialog>

      )}

    </>

  );

};



export default Introduction;


