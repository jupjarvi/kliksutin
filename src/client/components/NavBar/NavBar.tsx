import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  MenuItem,
  Box,
  Container,
  MenuList,
  Button,
  Paper,
  ClickAwayListener,
  Grow,
  Popper,
  Typography,
} from '@mui/material'
import { Language, AdminPanelSettingsOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import toskaBlack from '../../assets/toscalogo_black.svg'
import styles from './styles'
import useLoggedInUser from '../../hooks/useLoggedInUser'

const NavBar = () => {
  const { t, i18n } = useTranslation()
  const [openLanguageSelect, setOpenLanguageSelect] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const { user, isLoading } = useLoggedInUser()

  useEffect(() => {
    if (user?.language) {
      i18n.changeLanguage(user.language)
    }
  }, [user, i18n])

  const { language } = i18n
  const languages = ['fi', 'sv', 'en']

  const handleLanguageChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage)
    setOpenLanguageSelect(false)
  }

  const classes = styles.navStyles

  if (isLoading) return null

  return (
    <AppBar
      elevation={0}
      position="relative"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderRadius: 0,
        borderBottom: '1px solid black',
        py: '1rem',
      }}
    >
      <Container maxWidth={false}>
        <Toolbar sx={classes.toolbar} disableGutters>
          <Box display="inline-flex" alignItems="end" sx={classes.link}>
            <Link to="/" style={{ marginBottom: -5 }}>
              <img src={toskaBlack} alt="Toska" width="70" />
            </Link>
            <Box ml="2rem">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Typography
                  textTransform="uppercase"
                  color="black"
                  fontWeight={700}
                  fontSize={18}
                  sx={{ userSelect: 'none' }}
                >
                  {t('appName')}
                </Typography>
              </Link>
            </Box>
          </Box>
          <Box>
            {user.isAdmin && (
              <Link to="/admin">
                <Button>
                  <AdminPanelSettingsOutlined sx={{ mr: 1 }} /> {t('admin')}
                </Button>
              </Link>
            )}
            <Button
              ref={anchorRef}
              id="composition-button"
              aria-controls={
                openLanguageSelect ? 'composition-menu' : undefined
              }
              aria-expanded={openLanguageSelect ? 'true' : undefined}
              aria-haspopup="true"
              onClick={() => setOpenLanguageSelect(!openLanguageSelect)}
            >
              <Language sx={{ mr: 2 }} /> {language}
            </Button>
            <Popper
              open={openLanguageSelect}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom-start' ? 'left top' : 'left bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener
                      onClickAway={() =>
                        setOpenLanguageSelect(!openLanguageSelect)
                      }
                    >
                      <MenuList
                        autoFocusItem={openLanguageSelect}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                      >
                        {languages.map((l) => (
                          <MenuItem
                            key={l}
                            sx={[
                              classes.item,
                              language === l && classes.activeItem,
                            ]}
                            onClick={() => {
                              handleLanguageChange(l)
                            }}
                          >
                            {l.toUpperCase()}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavBar
